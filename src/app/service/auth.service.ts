import {  Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
 

@Injectable({providedIn:'root'})
export class AuthService {
 
    public SUPERADMIN_ROLE:string = "superadmin"; 
    public ADMIN_ROLE:string = "admin"; 
    public ATTENDANT_ROLE:string = "attendant"; 

    arrayRoleDefault:string[] = [         
        "default-roles-rocketchat",
        "offline_access",
        "uma_authorization"
    ];

    arrayRoles:any[] = [
        {
            "admin": "Administrador"
        },
        {
            "attendant": "Atendente"
        },
        {
            "guest": "Visitante"
        }
    
    ]
    getRole(userLocal:any){
        let userLocalPerfil:any = ["guest"];
        if(userLocal != null && userLocal.realm_access.roles != null){
            userLocalPerfil = userLocal.realm_access.roles
            .filter((item:any) => !this.arrayRoleDefault.includes(item))
        }
   
       
       for (const role of this.arrayRoles) {
            for (const key in role) {
                if (key === userLocalPerfil[0]) {
                    return role[key]; 
                }
            }
        }
 
    }
 

    getAccessToken():string | null{
        if(localStorage.getItem("access_token") != undefined){
            return localStorage.getItem("access_token") ;
        }else{
            return null;
        }
    }

    getRefreshToken():string | null{
        if(localStorage.getItem("refresh_token") != undefined){
            return localStorage.getItem("refresh_token") ;
        }else{
            return null;
        }
    }

    isLogged():boolean{
        return localStorage.getItem("access_token") != null 
                && localStorage.getItem("access_token") != "" ? true : false ;
    }


    setAccessToken(token : string):void{
        localStorage.setItem("access_token", token);
    }
    getRolesFromToken(): string[] {
        // Obter o token JWT do localStorage
        const token = localStorage.getItem('access_token');
        if (!token) {
          return [];
        }
    
        // Decodificar o token
        const decodedToken: any = jwtDecode(token);
        // Acessar as roles da claim 'realm_access'
        const roles = decodedToken.realm_access?.roles || [];
        return roles;
      }

      isTokenExpired(token: string | null): boolean {
        try { 
        if (token == null) {
            return true; // se null
            }

          const decodedToken: any = jwtDecode(token); // Decodifica o token
          if (!decodedToken.exp) {
            return true; // Se não houver 'exp', consideramos expirado
          }
  
    
          const currentTime = Math.floor(new Date().getTime() / 1000); // Tempo atual em segundos
          return decodedToken.exp < currentTime; // Compara expiração com o tempo atual
        } catch (error) {
          console.error('Erro ao decodificar o token:', error);
          return true; // Se houver algum erro no token, consideramos expirado
        }
      }
    

    setRefreshToken(token : string):void{
        localStorage.setItem("refresh_token", token);
    }

    flush(){
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    }

    hasRole(role: string): boolean {
        const roles = this.getRolesFromToken();

        
        return roles.includes(role);
      }

    getObjectUserLogged(){
        const newLocal = this.getAccessToken();
        if(newLocal != null){
 
            let jwtData = newLocal.split('.')[1]
            let decodedJwtJsonData = window.atob(jwtData) 
            return JSON.parse(decodedJwtJsonData)
        }else{
            return null;
        }
    }
}
