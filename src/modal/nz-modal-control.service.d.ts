import { Subject } from 'rxjs';
import { NzModalRef } from './nz-modal-ref.class';
export declare class NzModalControlService {
    private parentService;
    readonly afterAllClose: Subject<void>;
    readonly openModals: NzModalRef[];
    private rootOpenModals;
    private rootAfterAllClose;
    private rootRegisteredMetaMap;
    private readonly registeredMetaMap;
    constructor(parentService: NzModalControlService);
    registerModal(modalRef: NzModalRef): void;
    hasRegistered(modalRef: NzModalRef): boolean;
    closeAll(): void;
    private removeOpenModal(modalRef);
}
