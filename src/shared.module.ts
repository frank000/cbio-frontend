import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';

// apexchart
import { NgApexchartsModule } from 'ng-apexcharts';

// service
import { AppService } from 'src/app/service/app.service';

// i18n
import { TranslateModule } from '@ngx-translate/core';

// perfect-scrollbar
import { NgScrollbarModule, provideScrollbarOptions } from 'ngx-scrollbar';


// fullcalendar
import { FullCalendarModule } from '@fullcalendar/angular';

// headlessui
import { MenuModule } from 'headlessui-angular';


// select
import { NgSelectModule } from '@ng-select/ng-select';

// modal
import { NgxCustomModalComponent } from 'ngx-custom-modal';
// flatpicker
import { FlatpickrModule } from 'angularx-flatpickr';
// icons
import { IconModule } from 'src/app/shared/icon/icon.module';
import { LoginService } from './app/service/login.service';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { MatInputModule } from '@angular/material/input'; 


// input mask
import { TextMaskModule } from '@matheo/text-mask';
import { EmojiPickerModule } from '@chit-chat/ngx-emoji-picker/lib/providers';

@NgModule({
    imports: [CommonModule,MatFormFieldModule,      EmojiPickerModule,   MatInputModule, MatAutocompleteModule, TextMaskModule, FlatpickrModule.forRoot(), FullCalendarModule,NgApexchartsModule, NgxCustomModalComponent, FormsModule, ReactiveFormsModule, RouterModule, TranslateModule.forChild(), DataTableModule, NgScrollbarModule, MenuModule, IconModule, NgSelectModule],
    declarations: [],
    exports: [
        // modules
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule, 
        NgApexchartsModule, 
        DataTableModule,
        TextMaskModule,
        TranslateModule,
        NgxCustomModalComponent,
        FullCalendarModule,
        NgScrollbarModule,
        FlatpickrModule,
        MenuModule,
        MatInputModule,
        IconModule,
        MatAutocompleteModule,
        MatFormFieldModule,

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
