import { Component, inject, OnInit } from '@angular/core';
import { toggleAnimation } from 'src/app/shared/animations';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/service/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { LoginService } from '../service/login.service';
import { error } from 'console';
import { AuthService } from '../service/auth.service';


@Component({
    templateUrl: './boxed-signin.html',
    animations: [toggleAnimation],
    styleUrls:["./boxed-signin.css"]
})
export class BoxedSigninComponent implements OnInit{

    store: any;
    params!: FormGroup;
    authService = inject(AuthService);
    _router = inject(Router);

    constructor(
        public translate: TranslateService,
        public storeData: Store<any>,
        public router: Router,
        private appSetting: AppService,
        private loginService:LoginService,
        private fb: FormBuilder
    ) {
        this.initStore();
        this.initForm();

    }
    ngOnInit(): void {
        this.authService.flush();
    }
    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }
    
    initForm() {
        this.params = this.fb.group({
            id: [0],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.required], 
        });
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

    submit() { 
        if (this.params.controls['email'].errors) {
            this.showMessage('Email é obrigatório.', 'error');
            return;
        }
        if (this.params.controls['password'].errors) {
            this.showMessage('Senha é obrigatório.', 'error');
            return;
        } 
        this.loginService.login(
            this.params.controls['email'].value,
            this.params.controls['password'].value
        ).subscribe(
            (resp:any) => {
                this.loginService.onLogging.complete();
 
                this.authService.setAccessToken(resp["access_token"]) 
                this.authService.setRefreshToken(resp["refresh_token"]) 
                this._router.navigate(["/dashboard/summary"])
            }
        )
        
    }


    showMessage(msg = '', type = 'success') {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    }
}
