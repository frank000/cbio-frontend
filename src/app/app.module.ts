import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpBackend, HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { RouterModule } from '@angular/router';

//Routes
import { routes } from './app.route';

import { AppComponent } from './app.component';

import { DatePipe } from '@angular/common';


// store
import { StoreModule } from '@ngrx/store';
import { indexReducer } from './store/index.reducer';

// shared module
import { SharedModule } from 'src/shared.module';

// i18n
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// AOT compilation support
export function HttpLoaderFactory(httpHandler: HttpBackend): TranslateHttpLoader {
    return new TranslateHttpLoader(new HttpClient(httpHandler));
}

// dashboard
import { IndexComponent } from './index';

// Layouts
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';

import { HeaderComponent } from './layouts/header';
import { FooterComponent } from './layouts/footer';
import { SidebarComponent } from './layouts/sidebar';
import { ThemeCustomizerComponent } from './layouts/theme-customizer';
import { authInterceptor } from './interceptor/auth.interceptor';
import { jwtInterceptor } from './interceptor/jwt.interceptor copy';
import { ChatComponent } from './modules/apps/chat/chat';
import { PhraseModalComponent } from "./modules/apps/chat/modal/phrase-modal/phrase-modal.component";
import { loadingInterceptor } from './interceptor/loading.interceptor'; 
import { ViewTextMediaComponent } from "./modules/base/view-text-media/view-text-media.component";
import { AvatarComponent } from "./modules/base/avatar/avatar.component";
import { CalendarComponent } from './modules/agendai/calendar';
import { ContactsComponent } from './modules/apps/contacts/contacts';
import { BtnSalvaVoltaComponent } from "./modules/common/btn-salva-volta/btn-salva-volta.component";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
    imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpBackend],
        },
    }),
    StoreModule.forRoot({ index: indexReducer }),
    SharedModule.forRoot(),
    PhraseModalComponent,
    ViewTextMediaComponent,
    AvatarComponent,
    BtnSalvaVoltaComponent
],
    declarations: [AppComponent, ContactsComponent, CalendarComponent,ChatComponent, HeaderComponent, FooterComponent, SidebarComponent, ThemeCustomizerComponent, IndexComponent, AppLayout, AuthLayout],
    providers: [
        Title,
        DatePipe,
        provideHttpClient(withInterceptors([authInterceptor, jwtInterceptor, loadingInterceptor])),
        provideHttpClient(
            withFetch()
        ),
        provideAnimationsAsync()],
    bootstrap: [AppComponent],
})
export class AppModule {}
