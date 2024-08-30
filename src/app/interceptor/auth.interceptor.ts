import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs"; 
import { AuthService } from "../service/auth.service";
import { Router } from "@angular/router";
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
 
    const authService = inject(AuthService);
    const _router = inject(Router);
    const naoLinkLogin = !req.url.toString().includes("/login");

    const loginVazioNoBrowser = authService.getAccessToken() == null;
    if(loginVazioNoBrowser && naoLinkLogin){
        
        _router.navigate(["/auth/boxed-signin"])
    }
    
    return next(req);
  }; 