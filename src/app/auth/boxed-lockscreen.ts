import { Component, inject } from '@angular/core';
import { toggleAnimation } from 'src/app/shared/animations';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/service/app.service';
import { AvatarUtil } from '../modules/base/avatar-util';
import { AuthService } from '../service/auth.service';

@Component({
    templateUrl: './boxed-lockscreen.html',
    animations: [toggleAnimation],
})
export class BoxedLockscreenComponent {
    store: any;
    userLocal:any;
    private _authService = inject(AuthService);

    constructor(
        public translate: TranslateService,
        public storeData: Store<any>,
        public router: Router,
        private appSetting: AppService,
    ) {
        this.initStore();
        this.initDataAsUser();
    }
    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }
    initDataAsUser(){
        this.userLocal = this._authService.getObjectUserLogged();

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

    getInitialCharacters(){console.log("this.userLocal", this.userLocal);
    
        return AvatarUtil.getInitialCharacters(this.userLocal.name);
    }
}
