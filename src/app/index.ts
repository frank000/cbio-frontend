import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';

@Component({
    templateUrl: './index.html',
})
export class IndexComponent implements OnInit{

    _router = inject(Router)
    _auth = inject(AuthService)
    ngOnInit(): void {
        const isDeslogado = !this._auth.isLogged();
        const isTokenExpired = this._auth.isTokenExpired(this._auth.getAccessToken());
        
        if(isDeslogado || isTokenExpired){
            this._router.navigate(["/auth/boxed-signin"]);
        } 
    }
}
