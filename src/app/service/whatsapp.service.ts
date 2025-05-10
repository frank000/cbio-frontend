import { Injectable } from '@angular/core';
declare var FB: any; // Declaração opcional se já tiver o arquivo de tipos

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  constructor() { this.setupMessageListener()}

  // Função para configurar o listener de mensagens
  setupMessageListener() {
    window.addEventListener('message', (event) => {
      if (event.origin !== "https://www.facebook.com") return;
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'WA_EMBEDDED_SIGNUP') {
          console.log('Dados recebidos:', data);
          // Aqui você pode armazenar os dados recebidos, como o ID da conta do WhatsApp Business e o número de telefone
        }
      } catch (error) {
        console.error('Erro ao processar a mensagem:', error);
      }
    });
  }

  // Função de callback para o login do Facebook
  fbLoginCallback(response: any) {
    if (response.authResponse) {
      const code = response.authResponse.code;
      console.log('Código recebido:', code);
      // Envie o código para o seu backend para trocá-lo por um token de acesso
      // Exemplo: this.sendCodeToBackend(code);
    }
  }

  // Função para iniciar o fluxo de cadastro incorporado
  launchWhatsAppSignup() {
    FB.login(this.fbLoginCallback, {
      config_id: '1306172430660874', // Substitua pelo seu Configuration ID
      response_type: 'code', // Deve ser 'code' para obter um token de acesso
      override_default_response_type: true, // Sobrescreve o tipo de resposta padrão
      extras: {
        setup: {},
        featureType: 'EMBEDDED_SIGNUP',
        sessionInfoVersion: '3',
      }
      // extras: {
      //   setup: {
      //     business: {
      //       id: null,
      //       name: "Rayza Bot",
      //       phone: {},
      //       website: "https://e703-2804-8aa4-3e09-cd00-da94-a58b-c82a-766b.ngrok-free.app",
      //       address: { state: null, country: "BR" },
      //       timezone: null
      //     },
      //     phone: { category: null, description: "" },
      //     preVerifiedPhone: { ids: null },
      //     solutionID: null,
      //     whatsAppBusinessAccount: { ids: null }
      //   },
      //   featureType: '',
      //   sessionInfoVersion: '2',
      // }
    });
  }
}