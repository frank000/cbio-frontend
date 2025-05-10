import { Component, OnInit } from '@angular/core';
import { WhatsappService } from 'src/app/service/whatsapp.service';

@Component({
    selector: 'app-whatsapp-login',
    standalone: true,
    imports: [],
    templateUrl: './whatsapp-login.component.html',
    styleUrl: './whatsapp-login.component.css'
})
export class WhatsappLoginComponent implements OnInit {

    constructor(private whatsappService: WhatsappService) { }

    ngOnInit(): void {
        // Configura o listener de mensagens ao inicializar o componente
        this.whatsappService.setupMessageListener();
    }

    // Função para iniciar o fluxo de cadastro incorporado
    launchSignup() {
        this.whatsappService.launchWhatsAppSignup();
    }
}
