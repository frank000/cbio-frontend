import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "src/app/service/auth.service";


@Injectable({
    providedIn: "root",
  })
  export class AuthGuard implements CanActivate {
    constructor(
      private auth: AuthService,
      private router: Router
    ) {}
  
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ):
      | Observable<boolean | UrlTree>
      | Promise<boolean | UrlTree>
      | boolean
      | UrlTree {
      // Se o usuário estiver sem sessão,
      // o enviamos para a tela de login
      if (this.auth.isLogged()) {
        return true;
      }
  
      return this.router.parseUrl("/auth/boxed-signin");
    }
  }