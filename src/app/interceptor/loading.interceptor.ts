import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { finalize, Observable, tap } from "rxjs"; 
import { AuthService } from "../service/auth.service";
import { Router } from "@angular/router";
import { HttpInterceptorFn } from '@angular/common/http';
import Swal from "sweetalert2"; 

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  let patternUrlAvoidLoading = ["contact/grid"];
  
  let findedPatterns = patternUrlAvoidLoading
    .filter((pattern:string) => req.url.includes(pattern));
    
      if(findedPatterns.length === 0){
        // Exibe o loading ao iniciar uma requisição
        Swal.fire({
          title: 'Carregando...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
      }


      return next(req).pipe(
        tap(
          (event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              // Caso o response seja bem-sucedido, fechamos o loading
              if(event.status != 400){
                Swal.close();
              }
            
            }
          },
          (error: HttpErrorResponse) => {
            // Em caso de erro, fechamos o loading também
            if(error.status != 400){
                Swal.close();
              }
          }
        ),
        finalize(() => {
          // Fecha o loading após o término da requisição, mesmo que o `tap` não o tenha feito
        //   if(re.status != 400){
        //     Swal.close();
        //   }
        })
      );
    }
   

     