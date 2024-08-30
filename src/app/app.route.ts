import { Routes } from '@angular/router';

// dashboard
import { IndexComponent } from './index';
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';
import { AdminComponent } from './modules/admin/admin.component'; 
import { CompanyFormComponent } from './modules/admin/form/company-form/company-form.component';

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
