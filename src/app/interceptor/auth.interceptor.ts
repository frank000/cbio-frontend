import { inject } from "@angular/core";
import { AuthService } from "../service/auth.service";
import { Router } from "@angular/router";
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
 
    const authService = inject(AuthService);
    const _router = inject(Router);
    const naoLinkLogin = !req.url.toString().includes("/login");
    const token = authService.getAccessToken();
    const loginVazioNoBrowser = token == null;

   
    const isValid = !authService.isTokenExpired(token);

    if(loginVazioNoBrowser && naoLinkLogin && isValid){
        
        _router.navigate(["/auth/boxed-signin"])
    }
    
    return next(req);
  };