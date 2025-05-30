﻿import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, NavigationEnd } from '@angular/router';
import { AppService } from '../service/app.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { toggleAnimation } from 'src/app/shared/animations';
import { LoginService } from '../service/login.service';
import { AuthService } from '../service/auth.service';
 
import { AvatarUtil } from '../modules/base/avatar-util';
import { WebSocketService } from '../modules/base/websocket/websocket-service.service';

@Component({
    moduleId: module.id,
    selector: 'header',
    templateUrl: './header.html',
    animations: [toggleAnimation],
    standalone: false
})
export class HeaderComponent {
    store: any;
    search = false;
    loginService = inject(LoginService)
    userLocal:any;
    private _authService = inject(AuthService);
    authService = inject(AuthService);

    webSocketService = inject(WebSocketService);    


    notifications:any = [];
    messages = [
        {
            id: 1,
            image: this.sanitizer.bypassSecurityTrustHtml(
                `<span class="grid place-content-center w-9 h-9 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>`,
            ),
            title: 'Congratulations!',
            message: 'Your OS has been updated.',
            time: '1hr',
        },
        {
            id: 2,
            image: this.sanitizer.bypassSecurityTrustHtml(
                `<span class="grid place-content-center w-9 h-9 rounded-full bg-info-light dark:bg-info text-info dark:text-info-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>`,
            ),
            title: 'Did you know?',
            message: 'You can switch between artboards.',
            time: '2hr',
        },
        {
            id: 3,
            image: this.sanitizer.bypassSecurityTrustHtml(
                `<span class="grid place-content-center w-9 h-9 rounded-full bg-danger-light dark:bg-danger text-danger dark:text-danger-light"> <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>`,
            ),
            title: 'Something went wrong!',
            message: 'Send Reposrt',
            time: '2days',
        },
        {
            id: 4,
            image: this.sanitizer.bypassSecurityTrustHtml(
                `<span class="grid place-content-center w-9 h-9 rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">    <circle cx="12" cy="12" r="10"></circle>    <line x1="12" y1="8" x2="12" y2="12"></line>    <line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>`,
            ),
            title: 'Warning',
            message: 'Your password strength is low.',
            time: '5days',
        },
    ];

    sinalSonoro:boolean = false;
    
    constructor(
        public translate: TranslateService,
        public storeData: Store<any>,
        public router: Router,
        private appSetting: AppService,
        private sanitizer: DomSanitizer,
        private auth: AuthService
    ) {
        this.initStore();
        this.initDataAsUser();
    }


    userLocalPerfil:string = "visitante";

    initDataAsUser(){
        this.userLocal = this.authService.getObjectUserLogged();
 
        this.userLocalPerfil = this.authService.getRole(this.userLocal);

    }

    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }

    ngOnInit() {
        this.webSocketService.clearNotificationSubject
            .subscribe((resp:any) => this.notifications = []);
        this.setActiveDropdown();
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.setActiveDropdown();
            }
        });


        this.webSocketService.connectToObservable().subscribe(
            (resp: any) => {
              const topicAttendant = `/topic/notify.${this.userLocal.userId}`;
              console.log("Passo 1 - listen user ID", topicAttendant);
        
              this.subscribeToAttendantTopic(topicAttendant);
              console.log('Conexão estabelecida, agora vamos assinar os canais.');
            }
          );
    }

        /**
     * Função para garantir a inscrição no tópico individual do usuário.
     */
        subscribeToAttendantTopic(topicAttendant: string): void {
            this.webSocketService.getMessages(topicAttendant).subscribe((message: any) => {
                this.notifications.push(message)
                if(this.sinalSonoro) this.playAudio();
                console.log(`Mensagem recebida para o USUÁRIO ${topicAttendant}:`, message);
         
                 
            });
        }


    setActiveDropdown() {
        const selector = document.querySelector('ul.horizontal-menu a[routerLink="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }

    removeNotification(value: number) {
        this.notifications = this.notifications.filter((d:any) => d.id !== value);
    }

    removeMessage(value: number) {
        this.messages = this.messages.filter((d) => d.id !== value);
    }

    changeLanguage(item: any) {
        this.translate.use(item.code);
        this.appSetting.toggleLanguage(item);
        if (this.store.locale?.toLowerCase() === 'ae') {
            this.storeData.dispatch({ type: 'toggleRTL', payload: 'rtl' });
        } else {
            this.storeData.dispatch({ type: 'toggleRTL', payload: 'ltr' });
        }
        window.location.reload();
    }
    onLogout(){
        const refreshToken = this._authService.getRefreshToken();
        this.router.navigate(["/auth/boxed-signin"]);
        if(refreshToken != null){
            this.loginService.logout(refreshToken)
            .subscribe(
                (resp:any) =>{
                
                    this.router.navigate(["/auth/boxed-signin"]);
                    this.auth.flush();
                }
            );
        }else{
            this.router.navigate(["/auth/boxed-signin"]);
        }
     
    }

    playAudio(){
        let audio = new Audio();
        audio.src = "../../../assets/notification.mp3";
        audio.load();
        audio.play();
      }

    getInitialCharacters(){
        if(this.userLocal.name){
            return AvatarUtil.getInitialCharacters(this.userLocal.name);
        }else{
            return "USER";
        }
    }

    readAll(){
        this.notifications = [];
        this.router.navigate(["/apps/chat"]);

    }
}
