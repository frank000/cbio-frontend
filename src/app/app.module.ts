import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpBackend, HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { RouterModule } from '@angular/router';

//Routes
import { routes } from './app.route';

import { AppComponent } from './app.component';

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
    PhraseModalComponent
],
    declarations: [AppComponent, ChatComponent, HeaderComponent, FooterComponent, SidebarComponent, ThemeCustomizerComponent, IndexComponent, AppLayout, AuthLayout],
    providers: [
        Title,
        provideHttpClient(withInterceptors([authInterceptor, jwtInterceptor, loadingInterceptor])),
        provideHttpClient(
            withFetch()
        )],
    bootstrap: [AppComponent],
})
export class AppModule {}
