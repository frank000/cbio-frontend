import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs"; 
import { AuthService } from "../service/auth.service";
import { Router } from "@angular/router";
import { HttpInterceptorFn } from '@angular/common/http';
import { showMessage } from "../modules/base/showMessage";

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
        // add auth header with jwt if account is logged in and request is to the api url
        const _authService = inject(AuthService);
        const _router = inject(Router);
        
        if(_authService.isLogged()){

            let token = _authService.getAccessToken()

            req = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`
                }
              });
          
        }
    
       

        return next(req).pipe(
            catchError((err: any) => {
              if (err instanceof HttpErrorResponse) {
                // Handle HTTP errors
                if (err.status === 401) {
                  _authService.flush();
                  showMessage("Acesso não permitido.", "error")
                  _router.navigate(["/auth/boxed-signin"])
                } else if(err.status === 400){
                  console.log(err);
                  
                  showMessage(err.error.message, 'error')
                }else{
                  // Handle other HTTP error codes
                  console.error('HTTP error:', err);
                  _router.navigate(["/auth/boxed-signin"])
                }
              } else {
                // Handle non-HTTP errors
                // console.error('An error occurred:', err);
              }
        
              // Re-throw the error to propagate it further
              return throwError(() => err); 
            })
          );;
  }; 