import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    moduleId: module.id,
    selector: 'icon-disconnect',
    template: `
        <ng-template #template>
                        <svg width="20" height="20"
                   class="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2 "
            viewBox="0 0 24 24" id="_24x24_On_Light_Session-Leave" data-name="24x24/On Light/Session-Leave" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                 <path id="Shape" d="M2.95,17.5A2.853,2.853,0,0,1,0,14.75v-12A2.854,2.854,0,0,1,2.95,0h8.8a.75.75,0,0,1,0,1.5H2.95A1.362,1.362,0,0,0,1.5,2.75v12A1.363,1.363,0,0,0,2.95,16h8.8a.75.75,0,0,1,0,1.5Zm9.269-4.219a.751.751,0,0,1,0-1.061L14.939,9.5H5.75a.75.75,0,0,1,0-1.5h9.19L12.219,5.28A.75.75,0,1,1,13.28,4.22l4,4a.749.749,0,0,1,0,1.06l-4,4a.751.751,0,0,1-1.061,0Z" transform="translate(3.25 3.25)" fill="#676767"></path> </g></svg>
        
        </ng-template>
    `,
    standalone: false
})
export class IconDisconnectComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) {}
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
