import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { SharedModule } from 'src/shared.module';
import {environment} from "../../../../environments/environment";
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';
import { showMessage } from '../../base/showMessage';
import { CompanyService } from 'src/app/service/company.service';


@Component({
  selector: 'app-instagram',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './instagram.component.html',
  styleUrl: './instagram.component.css'
})
export class InstagramComponent implements OnDestroy {
 


  authService:AuthService = inject(AuthService);
  companyService:CompanyService = inject(CompanyService);
  companyId:string;
  credential:any;
  
  private popupWindow: Window | null = null;

  constructor() {
    // Escuta a mensagem do popup
    window.addEventListener('message', this.handleMessage.bind(this));
    this.companyId = this.authService.getObjectUserLogged().companyId;

    this.loadCredential();
  }

  private loadCredential() {
    this.companyService.getStatusInstagram(this.companyId)
      .subscribe(
        (result: any) => {
          this.credential = result;
        }
      );
  }

  handleMessage(event: MessageEvent) { 
    
    // Verifica se a mensagem veio da URL esperada
    if (environment.urlExternal.toString().includes(event.origin)) {
      if (event.data === 'instagram-login-success') {
        if (this.popupWindow) {
          this.popupWindow.close();

          this.loadCredential();

        }
      }
    }
  }

  handleInstagramLogin() {
    const width = 600;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

 
    let url = environment.urlExternal;
    
    
    if( this.companyId != null &&  this.companyId != ""){
      this.popupWindow = window.open(
        `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=596197303054369&redirect_uri=${url}/v1/public/meta/webhook/instagram/callback&response_type=code&state=${ this.companyId}&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish`,
        'Instagram Login',
        `width=${width},height=${height},left=${left},top=${top},popup=yes,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
      );
    }else{
      showMessage("Empresa não encontrada para o usuário. Contactar os administradores. ",'warning')
    }
  }


  ngOnDestroy() {
    // Remove o listener quando o componente é destruído
    window.removeEventListener('message', this.handleMessage.bind(this));
    if (this.popupWindow) {
      this.popupWindow.close();
    }
  }


 
}
