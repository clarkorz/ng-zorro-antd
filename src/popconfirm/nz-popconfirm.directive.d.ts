import { ComponentFactory, ComponentFactoryResolver, ElementRef, EventEmitter, OnDestroy, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { NzTooltipDirective } from '../tooltip/nz-tooltip.directive';
import { NzPopconfirmComponent } from './nz-popconfirm.component';
export declare class NzPopconfirmDirective extends NzTooltipDirective implements OnInit, OnDestroy {
    factory: ComponentFactory<NzPopconfirmComponent>;
    _condition: boolean;
    _okText: string;
    _okType: string;
    _cancelText: string;
    _onCancel: Subscription;
    _onConfirm: Subscription;
    nzOnCancel: EventEmitter<void>;
    nzOnConfirm: EventEmitter<void>;
    nzOkText: string;
    nzOkType: string;
    nzCancelText: string;
    nzCondition: boolean;
    constructor(elementRef: ElementRef, hostView: ViewContainerRef, resolver: ComponentFactoryResolver, renderer: Renderer2, tooltip: NzPopconfirmComponent);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
