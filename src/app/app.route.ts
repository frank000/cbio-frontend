import { Routes } from '@angular/router';

// dashboard 
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';
import { AdminComponent } from './modules/admin/admin.component'; 
import { CompanyFormComponent } from './modules/admin/form/company-form/company-form.component';
import { ChatComponent } from './modules/apps/chat/chat';
import { AttendantComponent } from './modules/admin/attendant/attendant.component';
import { FormAttendantComponent } from './modules/admin/attendant/form-attendant/form-attendant.component';
import { FormPhraseComponent } from './modules/admin/phrase/form-phrase/form-phrase.component';
import { PhraseComponent } from './modules/admin/phrase/phrase.component';
import { SummaryComponent } from './modules/dashboard/summary/summary.component';
import { CalendarComponent } from './modules/agendai/calendar';
import { RecursoComponent } from './modules/agendai/recurso/recurso.component';
import { FormRecursoComponent } from './modules/agendai/recurso/form-recurso/form-recurso.component';
import { TemplatesComponent } from './modules/admin/templates/templates.component';
import { FormTemplateComponent } from './modules/admin/templates/form-template/form-template.component';
import { ContactsComponent } from './modules/apps/contacts/contacts';
import { PreferencesComponent } from './modules/dashboard/preferences/preferences.component';
import { AuthGuard } from './modules/base/guard/auth-guard';
import { TicketComponent } from './modules/dashboard/ticket/ticket.component';
import { FormTicketComponent } from './modules/dashboard/ticket/form-ticket/form-ticket.component';
import { ProfileComponent } from './modules/admin/profile/profile.component';
import { InstagramComponent } from './modules/dashboard/instagram/instagram.component';

export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            // dashboard
            { path: '', component: SummaryComponent, data: { title: 'Home' } ,     canActivate: [AuthGuard],},

            { path: 'admin/config', component: AdminComponent, data: { title: 'Administração' } },
            { path: 'admin/config/form', component: CompanyFormComponent, data: { title: 'Administração' } },
            { path: 'admin/config/form/:companyid', 
                component: CompanyFormComponent,  
                data: { title: 'Administração' } },
            { path: 'admin/attendant', component: AttendantComponent, data: { title: 'Atendente' } },
            { path: 'admin/attendant/form', component: FormAttendantComponent, data: { title: 'Atendente' } },
            { path: 'admin/attendant/form/:id', component: FormAttendantComponent, data: { title: 'Atendente' } },

            { path: 'apps/chat', component: ChatComponent, data: { title: 'RAYZA.bot' } },
            { path: 'admin/phrase', component: PhraseComponent, data: { title: 'Frase automática' } },
            { path: 'admin/phrase/form', component: FormPhraseComponent, data: { title: 'Frase automática' } },
            { path: 'admin/phrase/form/:id', component: FormPhraseComponent, data: { title: 'Frase automática' } },

            { path: 'admin/template', component: TemplatesComponent, data: { title: 'Modelos' } },
            { path: 'admin/template/form', component: FormTemplateComponent, data: { title: 'Modelos' } },
            { path: 'admin/template/form/:id', component: FormTemplateComponent, data: { title: 'Modelos' } },


            { path: 'dashboard/summary', component: SummaryComponent, data: { title: 'Atendimentos' } },
            { path: 'dashboard/preferences', component: PreferencesComponent, data: { title: 'Preferências' } },
            { path: 'dashboard/tickets', component: TicketComponent, data: { title: 'Tickets' } },
            { path: 'dashboard/tickets/form', component: FormTicketComponent, data: { title: 'Tickets' } },
            { path: 'dashboard/tickets/form/:id', component: FormTicketComponent, data: { title: 'Tickets' } },


            { path: 'dashboard/instagram', component: InstagramComponent, data: { title: 'Instagram' } },
            
            { path: 'apps/agendai/calendar', component: CalendarComponent, data: { title: 'Agenda' } },
            { path: 'apps/agendai/recurso', component: RecursoComponent, data: { title: 'Recursos' } },
            { path: 'apps/agendai/recurso/form', component: FormRecursoComponent, data: { title: 'Recursos' } },
            { path: 'apps/agendai/recurso/form/:id', component: FormRecursoComponent, data: { title: 'Recursos' } },

            { path: 'apps/contacts', component: ContactsComponent, data: { title: 'Contatos' } },

            { path: 'admin/profile', component: ProfileComponent, data: { title: 'Perfil de usuário' } }
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
