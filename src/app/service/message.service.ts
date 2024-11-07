import { Injectable } from '@angular/core'; 
import { Subject } from 'rxjs';
import { Message } from '../shared/models/message';

 

@Injectable({providedIn:'root'})
export class MessageService {
 
    private messageSubject = new Subject<Message>();
 
   message$ = this.messageSubject.asObservable();

   sendMessage(message: Message) {
    this.messageSubject.next(message);
  }

  clearMessage() {
    this.messageSubject.next({ tipo: '', msg: '' });
  }
}

