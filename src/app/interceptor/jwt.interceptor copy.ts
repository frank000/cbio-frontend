import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs"; 
import { AuthService } from "../service/auth.service";
import { Router } from "@angular/router";
import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
        // add auth header with jwt if account is logged in and request is to the api url
        const _authService = inject(AuthService);
        
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
                  
                  // Specific handling for unauthorized errors         
                  console.error('Unauthorized request:', err);
                  // You might trigger a re-authentication flow or redirect the user here
                } else {
                  // Handle other HTTP error codes
                  console.error('HTTP error:', err);
                }
              } else {
                // Handle non-HTTP errors
                console.error('An error occurred:', err);
              }
        
              // Re-throw the error to propagate it further
              return throwError(() => err); 
            })
          );;
  }; 