"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const ts = require("typescript");
const ast_1 = require("../utils/ast");
const custom_theme_1 = require("../utils/custom-theme");
const ast_utils_1 = require("../utils/devkit-utils/ast-utils");
const change_1 = require("../utils/devkit-utils/change");
const config_1 = require("../utils/devkit-utils/config");
const ng_ast_utils_1 = require("../utils/devkit-utils/ng-ast-utils");
const route_utils_1 = require("../utils/devkit-utils/route-utils");
const lib_versions_1 = require("../utils/lib-versions");
const package_1 = require("../utils/package");
function default_1(options) {
    return schematics_1.chain([
        options && options.skipPackageJson ? schematics_1.noop() : addZorroToPackageJson(),
        options && options.theme ? downgradeLess() : schematics_1.noop(),
        setBootstrapPage(),
        addThemeToAppStyles(options),
        addModulesToAppModule(options),
        addI18n(options),
        (options && !options.skipPackageJson) || (options && !options.theme) ? installNodeDeps() : schematics_1.noop()
    ]);
}
exports.default = default_1;
/** 添加 i18n 配置, 取决于 options.i18n */
function addI18n(options) {
    return function (host) {
        const workspace = config_1.getWorkspace(host);
        const project = config_1.getProjectFromWorkspace(workspace, options.project);
        const modulePath = ng_ast_utils_1.getAppModulePath(host, project.architect.build.options.main);
        const moduleSource = ast_1.getSourceFile(host, modulePath);
        const locale = options.i18n;
        const localePrefix = locale.split('_')[0];
        if (!moduleSource) {
            throw new schematics_1.SchematicsException(`Module not found: ${modulePath}`);
        }
        if (!locale) {
            throw new schematics_1.SchematicsException(`Invalid locale-symbol`);
        }
        const allImports = ast_utils_1.findNodes(moduleSource, ts.SyntaxKind.ImportDeclaration);
        const changes = [
            route_utils_1.insertImport(moduleSource, modulePath, 'NZ_I18N', 'ng-zorro-antd'),
            route_utils_1.insertImport(moduleSource, modulePath, locale, 'ng-zorro-antd'),
            route_utils_1.insertImport(moduleSource, modulePath, 'registerLocaleData', '@angular/common'),
            route_utils_1.insertImport(moduleSource, modulePath, localePrefix, `@angular/common/locales/${localePrefix}`, true),
            ...ast_utils_1.addSymbolToNgModuleMetadata(moduleSource, modulePath, 'providers', `{ provide: NZ_I18N, useValue: ${locale} }`, null),
            ast_utils_1.insertAfterLastOccurrence(allImports, `\n\nregisterLocaleData(${localePrefix});`, modulePath, 0)
        ];
        const recorder = host.beginUpdate(modulePath);
        changes.forEach((change) => {
            if (change instanceof change_1.InsertChange) {
                recorder.insertLeft(change.pos, change.toAdd);
            }
        });
        host.commitUpdate(recorder);
        return host;
    };
}
/** 降级 less */
function downgradeLess() {
    return (host) => {
        package_1.addPackageToPackageJson(host, 'dependencies', 'less', '^2.7.3');
        return host;
    };
}
/** 添加 ng-zorro-antd 到 package.json 的 dependencies */
function addZorroToPackageJson() {
    return (host) => {
        package_1.addPackageToPackageJson(host, 'dependencies', 'ng-zorro-antd', lib_versions_1.zorroVersion);
        return host;
    };
}
/** 添加 BrowserAnimationsModule FormsModule HttpClientModule NgZorroAntdModule 到 app.module */
function addModulesToAppModule(options) {
    return (host) => {
        const workspace = config_1.getWorkspace(host);
        const project = config_1.getProjectFromWorkspace(workspace, options.project);
        ast_1.addModuleImportToRootModule(host, 'BrowserAnimationsModule', '@angular/platform-browser/animations', project);
        ast_1.addModuleImportToRootModule(host, 'FormsModule', '@angular/forms', project);
        ast_1.addModuleImportToRootModule(host, 'HttpClientModule', '@angular/common/http', project);
        ast_1.addModuleImportToRootModule(host, 'NgZorroAntdModule.forRoot()', 'ng-zorro-antd', project);
        return host;
    };
}
/** 添加样式配置 */
function addThemeToAppStyles(options) {
    return function (host) {
        const workspace = config_1.getWorkspace(host);
        const project = config_1.getProjectFromWorkspace(workspace, options.project);
        if (options.theme) {
            insertCustomTheme(project, host, workspace);
        }
        else {
            insertCompiledTheme(project, host, workspace);
        }
        return host;
    };
}
exports.addThemeToAppStyles = addThemeToAppStyles;
/** 将预设样式写入 theme.less，并添加到 angular.json */
function insertCustomTheme(project, host, workspace) {
    const themePath = 'src/theme.less';
    host.create(themePath, custom_theme_1.createCustomTheme());
    if (project.architect) {
        addStyleToTarget(project.architect.build, host, themePath, workspace);
        addStyleToTarget(project.architect.test, host, themePath, workspace);
    }
    else {
        throw new schematics_1.SchematicsException(`${project.name} does not have an architect configuration`);
    }
}
/** 设置引导页面到 app.component.ts */
function setBootstrapPage() {
    return (host) => {
        host.overwrite('src/app/app.component.html', `<a href="https://github.com/NG-ZORRO/ng-zorro-antd" target="_blank" style="display: flex;align-items: center;justify-content: center;height: 100%;width: 100%;">
  <img height="400" src="https://img.alicdn.com/tfs/TB1MGSRv21TBuNjy0FjXXajyXXa-89-131.svg">
</a>
`);
        return host;
    };
}
/** 安装依赖 */
function installNodeDeps() {
    return (host, context) => {
        context.addTask(new tasks_1.NodePackageInstallTask());
    };
}
/** 将编译的 css 添加到 angular.json */
function insertCompiledTheme(project, host, workspace) {
    const themePath = `node_modules/ng-zorro-antd/src/ng-zorro-antd.min.css`;
    if (project.architect) {
        addStyleToTarget(project.architect.build, host, themePath, workspace);
        addStyleToTarget(project.architect.test, host, themePath, workspace);
    }
    else {
        throw new schematics_1.SchematicsException(`${project.name} does not have an architect configuration`);
    }
}
/** Adds a style entry to the given target. */
function addStyleToTarget(target, host, asset, workspace) {
    const styleEntry = asset;
    // We can't assume that any of these properties are defined, so safely add them as we go
    // if necessary.
    if (!target.options) {
        target.options = { styles: [styleEntry] };
    }
    else if (!target.options.styles) {
        target.options.styles = [styleEntry];
    }
    else {
        const existingStyles = target.options.styles.map(s => typeof s === 'string' ? s : s.input);
        const hasGivenTheme = existingStyles.find(s => s.includes(asset));
        if (!hasGivenTheme) {
            target.options.styles.splice(0, 0, styleEntry);
        }
    }
    host.overwrite('angular.json', JSON.stringify(workspace, null, 2));
}
//# sourceMappingURL=index.js.map