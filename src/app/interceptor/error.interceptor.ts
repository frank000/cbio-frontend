import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs"; 
import { AuthService } from "../service/auth.service";
import { Router } from "@angular/router";
import { HttpInterceptorFn } from '@angular/common/http';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
      catchError((err: any) => {
        if (err) {
          switch (err.status) {
            case 400:
              // Tratar erro 400
              console.error('Erro 400: Requisição inválida');
              break;
            case 401:
              // Tratar erro 401
              console.error('Erro 401: Não autorizado');
              break;
            default:
              // Tratar outros erros
              console.error(`Erro ${err.status}:`, err.message);
              break;
          }
        }
    console.log("chegou");
    
        return throwError(() => err); // Certifique-se de retornar o erro como Observable
      })
    );
  };