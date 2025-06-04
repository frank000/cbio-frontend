import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from "../../environments/environment";

declare global {
    interface Window {
        fbAsyncInit: () => void;
        FB: any;
    }
}

interface WhatsAppSignupData {
    type: string;
    waba_id?: string;
    phone_number?: string;
    display_name?: string;
    token?: string;

    code?: string; // Adicionado para compatibilidade
}

@Injectable({
    providedIn: 'root'
})
export class WhatsappService {
    url:string = environment.urlBackend;

    private readonly apiVersion = 'v22.0';
    private readonly baseUrl = `https://graph.facebook.com/${this.apiVersion}`;


    private readonly validOrigins = [
        'https://www.facebook.com',
        'https://web.facebook.com',
        'https://facebook.com'
    ];

    constructor(
        private http: HttpClient
    ) {
        this.loadFacebookSDK();
        this.setupMessageListener();
    }

    private loadFacebookSDK(): void {
        if (document.getElementById('facebook-jssdk')) return;



        const script = document.createElement('script');
        script.id = 'facebook-jssdk';
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        script.async = true;
        script.defer = true;
        script.crossOrigin = 'anonymous';
        document.body.appendChild(script);
    }

    setupMessageListener(): void {
        window.addEventListener('message', (event) => {
            if (!this.validOrigins.some(origin => event.origin.includes(origin))) return;
    
            console.log("Dados recebidos do Facebook:", event.data);
    
            try {
                let parsedData: WhatsAppSignupData | null = null;
                
                // Tentativa 1: Verificar se é uma string de parâmetros de URL
                if (typeof event.data === 'string' && event.data.includes('code=')) {
                    const params = new URLSearchParams(event.data);
                    const code = params.get('code');
                    
                    if (code) {
                        parsedData = {
                            type: 'WA_EMBEDDED_SIGNUP',
                            token: code // O 'code' é o token trocável
                        };
                        
                        // Extrair outros parâmetros se necessário
                        const wabaId = params.get('waba_id');
                        const phoneNumber = params.get('phone_number');
                        
                        if (wabaId) parsedData.waba_id = wabaId;
                        if (phoneNumber) parsedData.phone_number = phoneNumber;
                    }
                }
                // Tentativa 2: Verificar se é JSON
                else if (typeof event.data === 'string') {
                    try {
                        parsedData = JSON.parse(event.data);
                    } catch (jsonError) {
                        console.log('Os dados não são um JSON válido:', event.data);
                    }
                }
    
                // Processar os dados se foram extraídos com sucesso
                if (parsedData && parsedData.type === 'WA_EMBEDDED_SIGNUP') {
                    console.log('Dados processados:', parsedData);
                    this.handleSignupSuccess(parsedData);
                } else {
                    console.warn('Formato de dados não reconhecido ou tipo inválido:', event.data);
                }
            } catch (error) {
                console.error('Erro ao processar mensagem:', error);
            }
        });
    }



    // setupMessageListener(): void {
    //     window.addEventListener('message', (event) => {
    //         if (!this.validOrigins.some(origin => event.origin.includes(origin))) return;

    //         console.log("retorno setupMessageListener" , event);
    //         try {
                
    //             const data: WhatsAppSignupData = JSON.parse(event.data);
    //             console.log('Evento recebido:', data);

    //             if (data.type === 'WA_EMBEDDED_SIGNUP') {
    //                 this.handleSignupSuccess(data);
    //             }
    //         } catch (error) {
    //             console.error('Erro ao processar mensagem:', error);
    //         }
    //     });
    // }

    private handleSignupSuccess(data: WhatsAppSignupData): void {
        console.log('Cadastro WhatsApp concluído:', data);
        // Envie para seu backend ou armazene
        if (data.waba_id && data.phone_number && data.token) {
            this.sendToBackend({
                wabaId: data.waba_id,
                phoneNumber: data.phone_number,
                displayName: data.display_name,
                token: data.token
            });
        }
    }

    private sendToBackend(data: any): void {
        // Implemente a chamada HTTP para seu backend
        console.log('Enviando dados para backend:', data);
        // Exemplo:
        // return this.http.post('/api/whatsapp/signup', data);
    }

    public launchWhatsAppSignup(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (typeof FB === 'undefined') {
                return reject(new Error('SDK do Facebook não carregado'));
            }

            FB.login((response: any) => {
                if (response.authResponse) {
                    console.log('Autorização concedida:', response);

                    this.completeIntegration(response.authResponse.code, this.apiVersion);

                    resolve(response.authResponse.code);
                } else {
                    console.log('Usuário cancelou o fluxo');
                    reject(new Error('Usuário cancelou a autorização'));
                }
            }, {
                config_id: '768195059069245',
                response_type: 'code',
                override_default_response_type: true,
                extras: {
                    setup: {
                        business: {
                            name: "Nome do Seu Negócio",
                            website: window.location.href,
                            address: { country: "BR" }
                        }
                    },
                    featureType: 'EMBEDDED_SIGNUP',
                    sessionInfoVersion: '3',
                }
            });
        });
    }


    exchangeCodeForToken(code: string): Promise<any> {

        return this.http.post<any>(this.url + '/v1/whatsapp/exchange-token', { code }).toPromise();

    }

    /**
     * Obtém todos os números de telefone associados à WABA
     */
    getPhoneNumbers(wabaId: string, accessToken: string): Promise<any[]> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${accessToken}`
        });

        // @ts-ignore
        return this.http.get<{ data: any[] }>(
            `${this.baseUrl}/${wabaId}/phone_numbers`,
            { headers }
        ).toPromise()
            .then((response) => {
                console.log(response)
                if(response !=  undefined){
                    response.data
                }
            });
    }

    /**
     * Registra o número para uso com a API
     */
    registerPhoneNumber(phoneNumberId: string, accessToken: string): Promise<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${accessToken}`
        });

        const body = {
            messaging_product: "whatsapp"
        };

        return this.http.post(
            `${this.baseUrl}/${phoneNumberId}/register`,
            body,
            { headers }
        ).toPromise();
    }

    /**
     * Configura webhooks para receber mensagens
     */
    subscribeToWebhooks(wabaId: string, accessToken: string): Promise<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${accessToken}`
        });

        const body = {
            subscribed_fields: ["messages", "message_template_status_update"]
        };

        return this.http.post(
            `${this.baseUrl}/${wabaId}/subscribed_apps`,
            body,
            { headers }
        ).toPromise();
    }

    // async completeIntegration(code:any, wabaId:any) {
    //     console.log("code" , code);
    //     // 1. Troca o código por token
    //     const accessToken = await this.exchangeCodeForToken(code);
    //     console.log("accessToken", accessToken)

    //     // 2. Obtém os números de telefone
    //     const phoneNumbers = await this.getPhoneNumbers(wabaId, accessToken);
    //     console.log("phoneNumbers", phoneNumbers)

    //     // 3. Pega o primeiro número (ou o selecionado)
    //     const primaryPhone = phoneNumbers[0];
    //     const phoneNumberId = primaryPhone.id;

    //     // 4. Registra o número
    //     await this.registerPhoneNumber(phoneNumberId, accessToken);

    //     // 5. Configura webhooks (opcional)
    //     await this.subscribeToWebhooks(wabaId, accessToken);

    //     return {
    //         accessToken,
    //         phoneNumberId,
    //         wabaId
    //     };
    // }

    async completeIntegration(code: string, wabaId?: string): Promise<any> {
        try {
            console.log("Iniciando integração com código:", code);
            
            // 1. Troca o código por token
            const tokenResponse = await this.exchangeCodeForToken(code);
            const accessToken = tokenResponse.access_token;
            console.log("Token de acesso recebido:", accessToken);
    
            // Se não tivermos wabaId, tentamos obter das contas do usuário
            if (!wabaId) {
                const wabas = await this.getWhatsAppBusinessAccounts(accessToken);
                if (wabas && wabas.length > 0) {
                    wabaId = wabas[0].id;
                    console.log("WABA ID obtido:", wabaId);
                }
            }
    
            if (!wabaId) {
                throw new Error('Nenhuma conta WhatsApp Business encontrada');
            }
    
            // Restante do fluxo...
            const phoneNumbers = await this.getPhoneNumbers(wabaId, accessToken);
            console.log("Números de telefone encontrados:", phoneNumbers);
    
            if (!phoneNumbers || phoneNumbers.length === 0) {
                throw new Error('Nenhum número de telefone associado à conta');
            }
    
            const primaryPhone = phoneNumbers[0];
            const phoneNumberId = primaryPhone.id;
            console.log("Número principal:", primaryPhone);
    
            await this.registerPhoneNumber(phoneNumberId, accessToken);
            await this.subscribeToWebhooks(wabaId, accessToken);
    
            return {
                accessToken,
                phoneNumberId,
                wabaId
            };
        } catch (error) {
            console.error('Erro na integração completa:', error);
            throw error;
        }
    }

    private async getWhatsAppBusinessAccounts(accessToken: string): Promise<any[]> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${accessToken}`
        });
    
        try {
            const response = await this.http.get<{data: any[]}>(
                `${this.baseUrl}/me/owned_whatsapp_business_accounts`,
                { headers }
            ).toPromise();
            
            return response?.data || [];
        } catch (error) {
            console.error('Erro ao obter contas WhatsApp Business:', error);
            return [];
        }
    }
    
}
