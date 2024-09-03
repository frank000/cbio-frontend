import { Routes } from '@angular/router';

// dashboard
import { IndexComponent } from './index';
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';
import { AdminComponent } from './modules/admin/admin.component'; 
import { CompanyFormComponent } from './modules/admin/form/company-form/company-form.component';
import { ChatComponent } from './modules/apps/chat/chat';
import { AttendantComponent } from './modules/admin/attendant/attendant.component';
import { FormAttendantComponent } from './modules/admin/attendant/form-attendant/form-attendant.component';
import { FormPhraseComponent } from './modules/admin/phrase/form-phrase/form-phrase.component';
import { PhraseComponent } from './modules/admin/phrase/phrase.component';

export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            // dashboard
            { path: '', component: IndexComponent, data: { title: 'Sales Admin' } },

            { path: 'admin/config', component: AdminComponent, data: { title: 'Administração' } },
            { path: 'admin/config/form', component: CompanyFormComponent, data: { title: 'Administração' } },
            { path: 'admin/config/form/:companyid', 
                component: CompanyFormComponent,  
                data: { title: 'Administração' } },
            { path: 'admin/attendant', component: AttendantComponent, data: { title: 'Atendente' } },
            { path: 'admin/attendant/form', component: FormAttendantComponent, data: { title: 'Atendente' } },
            { path: 'admin/attendant/form/:id', component: FormAttendantComponent, data: { title: 'Atendente' } },

            { path: 'apps/chat', component: ChatComponent, data: { title: 'Chat' } },
            { path: 'admin/phrase', component: PhraseComponent, data: { title: 'Frase automática' } },
            { path: 'admin/phrase/form', component: FormPhraseComponent, data: { title: 'Frase automática' } },
            { path: 'admin/phrase/form/:id', component: FormPhraseComponent, data: { title: 'Frase automática' } },
        ],
    },
    

    {
        path: '',
        component: AuthLayout,
        children: [
            // pages
            { path: '', loadChildren: () => import('./pages/pages.module').then((d) => d.PagesModule) },

            // auth
            { path: '', loadChildren: () => import('./auth/auth.module').then((d) => d.AuthModule) },
        ],
    },
];
