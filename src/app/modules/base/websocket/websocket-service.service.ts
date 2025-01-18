// src/app/services/websocket.service.ts
import { Injectable } from '@angular/core';
import { Client, Message, Stomp } from '@stomp/stompjs';
// import * as SockJS from 'sockjs-client';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client;
  private messageSubject = new Subject<string>();
  public clearNotificationSubject = new Subject<boolean>();
  url:string = environment.urlBackendWS;

  constructor() {
 
    this.client = new Client({
 // URL do WebSocket
      reconnectDelay: 200,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 2000,
      debug: (msg: string): void => {
             console.log(new Date(), msg);
          },
      webSocketFactory: () => new SockJS(this.url) // Use SockJS caso seja necessário
    });

 
    this.client.onStompError = (frame) => {
      console.error('Erro STOMP: ' + frame.headers['message']);
      console.error('Detalhes: ' + frame.body);
    };
    
    
  }


  connectToObservable(): Observable<void> {
    return new Observable((observer) => {
      if (!this.client.connected) {
        this.client.onConnect = (frame) => {
          console.log('Conectado: ' + frame);
          observer.next(); // Emite um valor quando a conexão é estabelecida
          observer.complete(); // Finaliza o observable
        };
  
        this.client.onStompError = (frame) => {
          console.error('Erro STOMP: ' + frame.headers['message']);
          observer.error('Erro ao conectar: ' + frame.body); // Emite um erro se a conexão falhar
        };
  
        this.client.activate(); // Ativa a conexão
      } else {
        observer.next(); // Conexão já ativa
        observer.complete();
      }
    });
  }


  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.client.connected) {
        this.client.onConnect = (frame) => {
          console.log('Conectado: ' + frame);
          resolve(); // Resolve a Promise quando a conexão for bem-sucedida
        };
  
        this.client.onStompError = (frame) => {
          console.error('Erro STOMP: ' + frame.headers['message']);
          reject('Erro ao conectar: ' + frame.body); // Rejeita a Promise em caso de erro
        };
  
        this.client.activate(); // Ativa a conexão
      } else {
        // Já está conectado, então resolve imediatamente
        resolve();
      }
    });
  }

  isActive():boolean{
    return this.client.active;
  }

  disconnect() {
    this.client.deactivate();
  }

  sendMessage(destination: string, body: any) {
    this.client.publish({ destination, body: JSON.stringify(body) });
  }

// Certifique-se de inicializar subscribeListPath e messageSubjects como objetos
subscribeListPath:any =  {}; // Armazena as inscrições por canal
messageSubjects:any = {}; // Armazena os Subjects para cada canal


getMessages(caminho: string) {
  // Verifica se o cliente WebSocket está conectado
  if (this.client.connected) {
    // Verifica se já existe um Subject para este canal
    if (!this.messageSubjects[caminho]) {
      // Cria um novo Subject para o canal
      this.messageSubjects[caminho] = new Subject<any>();
    }

   
    // Inscreve-se no tópico especificado e armazena a inscrição
    let subs = this.client.subscribe(caminho, (message: Message) => {
      if (message.body) {
        this.messageSubjects[caminho].next(message.body);
      }
    });

    // Armazena a inscrição no caminho correspondente
    this.subscribeListPath[caminho] = subs;

    console.log(`Nova inscrição realizada no canal: ${caminho}`);

    // Retorna o Subject específico do canal como um Observable
    return this.messageSubjects[caminho].asObservable();
  } else {
    console.error('WebSocket not connected!');
    return new Observable(observer => {
      observer.error('WebSocket not connected!');
    });
  }
}

  unsubscribeAllChannel() {
    if (this.subscribeListPath.length > 0) {
      this.subscribeListPath.forEach(
        (resp:any)=>{
            resp.unsubscribe(); // Cancela a inscrição
        }
      )
      console.log('Inscrição cancelada com sucesso');
    } else {
      console.log('Nenhuma inscrição ativa para cancelar');
    }
  }
  getMessagesIndex( caminho : string, index:number) {
    this.client.onConnect = (frame) => {
        console.log('Conectado: ' + frame);
        this.client.subscribe(caminho, (message: Message) => {
          if (message.body) {
            this.messageSubject.next(message.body);
          }
        }, { id: `sub-${index}` });
      };
    return this.messageSubject.asObservable();
  }


  
}