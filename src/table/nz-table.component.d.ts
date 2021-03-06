import { Overlay } from '@angular/cdk/overlay';
import { AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, OnInit, QueryList, TemplateRef } from '@angular/core';
import { NzMeasureScrollbarService } from '../core/services/nz-measure-scrollbar.service';
import { NzI18nService } from '../i18n/nz-i18n.service';
import { NzThComponent } from './nz-th.component';
import { NzTheadComponent } from './nz-thead.component';
export declare class NzTableComponent implements OnInit, AfterViewInit, OnDestroy {
    private elementRef;
    private cdr;
    private overlay;
    private nzMeasureScrollbarService;
    private i18n;
    private i18n$;
    private _bordered;
    private _showPagination;
    private _loading;
    private _showSizeChanger;
    private _showQuickJumper;
    private _hideOnSinglePage;
    private _scroll;
    private _footer;
    private _title;
    private _noResult;
    private _pageIndex;
    private _pageSize;
    private _widthConfig;
    private _frontPagination;
    locale: any;
    nzTheadComponent: NzTheadComponent;
    isFooterString: boolean;
    isTitleString: boolean;
    isNoResultString: boolean;
    el: HTMLElement;
    scrollPosition: string;
    lastScrollLeft: number;
    rawData: any[];
    syncData: any[];
    /** public data for ngFor tr */
    data: any[];
    headerBottomStyle: any;
    isWidthConfigSet: boolean;
    tableHeaderElement: ElementRef;
    tableBodyElement: ElementRef;
    listOfNzThComponent: QueryList<NzThComponent>;
    nzPageSizeChange: EventEmitter<number>;
    nzPageIndexChange: EventEmitter<number>;
    nzShowTotal: TemplateRef<{
        $implicit: number;
        range: [number, number];
    }>;
    nzCurrentPageDataChange: EventEmitter<any[]>;
    nzSize: string;
    /** page size changer select values */
    nzPageSizeOptions: number[];
    nzLoadingDelay: number;
    nzTotal: number;
    nzFrontPagination: boolean;
    nzWidthConfig: string[];
    nzTitle: string | TemplateRef<void>;
    nzFooter: string | TemplateRef<void>;
    nzNoResult: string | TemplateRef<void>;
    nzBordered: boolean;
    nzShowPagination: boolean;
    nzLoading: boolean;
    nzShowSizeChanger: boolean;
    nzHideOnSinglePage: boolean;
    nzShowQuickJumper: boolean;
    nzScroll: {
        x: string;
        y: string;
    };
    nzData: any[];
    parseInputData(): void;
    nzPageIndex: number;
    emitPageIndex(index: number): void;
    emitPageSize(size: number): void;
    nzPageSize: number;
    checkPageIndexBounding(): void;
    generateSyncDisplayData(): void;
    syncScrollTable(e: MouseEvent): void;
    setScrollPositionClassName(): void;
    fitScrollBar(): void;
    onWindowResize(): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    constructor(elementRef: ElementRef, cdr: ChangeDetectorRef, overlay: Overlay, nzMeasureScrollbarService: NzMeasureScrollbarService, i18n: NzI18nService);
}
