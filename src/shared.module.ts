import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

// service
import { AppService } from 'src/app/service/app.service';

// i18n
import { TranslateModule } from '@ngx-translate/core';

// perfect-scrollbar
import { NgScrollbarModule, provideScrollbarOptions } from 'ngx-scrollbar';

// headlessui
import { MenuModule } from 'headlessui-angular';


// select
import { NgSelectModule } from '@ng-select/ng-select';


// icons
import { IconModule } from 'src/app/shared/icon/icon.module';
import { LoginService } from './app/service/login.service';
import { DataTableModule } from '@bhplugin/ng-datatable';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, TranslateModule.forChild(), DataTableModule, NgScrollbarModule, MenuModule, IconModule, NgSelectModule],
    declarations: [],
    exports: [
        // modules
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        DataTableModule,
        TranslateModule,
        NgScrollbarModule,
        MenuModule,
        IconModule,
    ],
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<any> {
        return {
            ngModule: SharedModule,
            providers: [
                Title,
                AppService,
                LoginService,
                provideScrollbarOptions({
                    visibility: 'hover',
                    appearance: 'compact',
                }),
            ],
        };
    }
}
