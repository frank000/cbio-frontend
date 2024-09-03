import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { toggleAnimation } from 'src/app/shared/animations';
import { NgScrollbar } from 'ngx-scrollbar';
import { Store } from '@ngrx/store';
import { LoginService } from '../../../service/login.service';
import { WebSocketService } from '../../base/websocket/websocket-service.service'; 
import { AuthService } from 'src/app/service/auth.service';
import { WebsocketNotificationDTO } from 'src/app/shared/models/WebsocketNotificationDTO';
import { ChatSessionService } from 'src/app/service/chatsession.service';
import { log } from 'console';
import { colDef } from '@bhplugin/ng-datatable';
import { PhraseService } from 'src/app/service/phrase.service';
 

@Component({
    templateUrl: './chat.html',
    animations: [toggleAnimation]
})
export class ChatComponent implements OnInit, OnDestroy{

    loginService = inject(LoginService);
    webSocketService = inject(WebSocketService);    
    authService = inject(AuthService);
    chatSessionService = inject(ChatSessionService);
    userLocal:any;
    loginUser:any;

    receivedMessages: string[] = [];

    constructor(public storeData: Store<any>) {
        this.userLocal = this.authService.getObjectUserLogged();
        this.initWebsocket();
        this.initStore();
        this.initGridPhrase();
      

    }

    ngOnInit(): void {
        this.chatSessionService.getAll()
        .subscribe(
            (resp:any)=>{
                console.log("Recevido -", resp);
                resp.map((item:any) =>{
                    this.contactList.push(item);
                   //listen channel individually   
                    this.subscribeIndividuallyChannel(item.channelId, item.userId); 

                })
                

            }
        )
    }

    ngOnDestroy() {
        //this.webSocketService.disconnect();
    }
    

    async initWebsocket(){
        if(this.userLocal != null){
            if(!this.webSocketService.isActive()){
                this.webSocketService.disconnect();
                this.webSocketService.connect();
            
                this.webSocketService.getMessages("/topic/demo."+this.userLocal.userId)
                .subscribe((message: string) => { 

               
                    let objCommingFromInit:WebsocketNotificationDTO = JSON.parse(message);
                    
                    this.contactList.filter(
                        (item:any)=>item.userId == objCommingFromInit.userId
                    )
                    .map((item:any) => {
                        if(item.userId == objCommingFromInit.userId){
                            item.preview = objCommingFromInit.preview
                            item.time = objCommingFromInit.time
                        }else{
                            this.contactList.push(objCommingFromInit)
                        }
                    });

                     //listen channel individually   
                    this.subscribeIndividuallyChannel(objCommingFromInit.channelId, objCommingFromInit.userId); 

                });
            }
        }
    }


    store: any;
    private subscribeIndividuallyChannel(channelId:any,  userId:any) { 
        console.log("/topic/demo." + channelId);
        
        this.webSocketService.getMessages("/topic/demo." + channelId)
            .subscribe((subMessage: string) => {
                console.log("Recebido do canal " , subMessage);
                //TODO adicionar msg na tela
                this.contactList.filter(
                    (item: any) => item.userId == userId
                )
                    .map((item: any) => {
                        if (item.userId == userId) {
                            if(item.messages == null)
                            {
                                item.messages = [JSON.parse(subMessage)]
                            }else{
                                item.messages.push(JSON.parse(subMessage));
                            }
                           
                        }
                    });
            });
    }

    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
        console.log(this.userLocal);
        
        this.loginUser = {
            id: 0,
            name: this.userLocal.name,
            path: 'profile-34.jpeg',
            designation: 'Software Developer',
        };
    }

    @ViewChild('scrollable') scrollable!: NgScrollbar;
    isShowUserChat = false;
    isShowChatMenu = false;

    contactList: WebsocketNotificationDTO[] = [
        {
            userId: "1",
            name: 'Nia Hillyer',
            path: 'profile-16.jpeg',
            time: '2:09 PM',
            preview: 'How do you do?',
            messages: [
                {
                    fromUserId: 0,
                    toUserId: 1,
                    text: 'Hi, I am back from vacation',
                    time: '',
                },
                {
                    fromUserId: 0,
                    toUserId: 1,
                    text: 'How are you?',
                    time: '',
                },
                {
                    fromUserId: 1,
                    toUserId: 0,
                    text: 'Welcom Back',
                    time: '',
                },
                {
                    fromUserId: 1,
                    toUserId: 0,
                    text: 'I am all well',
                    time: '',
                },
                {
                    fromUserId: 0,
                    toUserId: 1,
                    text: 'Coffee?',
                    time: '',
                },
            ],
            active: true,
        } as WebsocketNotificationDTO
    ];
    searchUser = '';
    searchPhraseField = '';
    textMessage = '';
    selectedUser: any = null;

    searchUsers() {
        return this.contactList.filter((d: { name: string }) => {
            if(d.name != null){
                return d.name.toLowerCase().includes(this.searchUser);
            }else{
                return "Cliente";
            }
            
        });
    }

    selectUser(user: any) {
        this.selectedUser = user;
        this.isShowUserChat = true;
        this.scrollToBottom();
        this.isShowChatMenu = false;
    }

    sendMessage(channelId:any) {
        if (this.textMessage.trim()) {
            const user: any = this.contactList.find((d: { userId: any }) => d.userId === this.selectedUser.userId);
           console.log(" use " , user);       
             console.log(" ID: " , this.selectedUser.userId);
                   console.log(" IDs: " ,  this.userLocal.userId);
           
            const menssage = {
                fromUserId:  this.selectedUser.userId,
                toUserId: this.userLocal.userId,
                text: this.textMessage,
                time: 'Just now',
            };
            if(user.messages==null){    
                user.messages = [menssage];
            }else{
                user.messages.push(menssage);    
            }
            

            this.sender(channelId, menssage);


            this.textMessage = '';



            this.scrollToBottom();
        }
    }

    scrollToBottom() {
        if (this.isShowUserChat) {
            setTimeout(() => {
                this.scrollable.scrollTo({ bottom: 0 });
            });
        }
    }

    getInitialCharacters(nameParam:any = null){
        let name = (nameParam != null)? nameParam : this.userLocal.name;
        let arrName:any[] = name.split(" ");
        if(arrName.length > 0){
            let returnName = ""
            arrName
            .forEach( 
                (name, index) => {
                    returnName += name.substring(0,1);
                    if((arrName.length - 1) > index  )
                        returnName += " "
                }
            )
            return returnName;
        }else{
            return name.substring(0,1)
        } 
    }

    sender(channelId:any, menssage:any){ 
        this.webSocketService.sendMessage(   '/app/demo.'+channelId , menssage);
      }


    //   modal phrase

    gridRowsPhrase:any[] = [];
    colsPhrase: Array<colDef> = [];
    totalRowsUser!:number  

    _phraseService = inject(PhraseService);
    initGridPhrase(){
        this.colsPhrase = [ 
            { field: "description", title: "Descrição" },
      
            { field: "acoes", title: "Ações" }
      
          ];
        this._phraseService.getAll()
        .subscribe(
            (resp:any)=>{
                this.gridRowsPhrase = resp;
            }
        );
    }

    selectPhrase(value:any, model:any){
        this.textMessage = value
        model.close()
    }
    searchPhrase() {
        return this.gridRowsPhrase.filter((d: { description: string }) => {
            if(d.description != null){
                return d.description.toLowerCase().includes(this.searchPhraseField);
            }else{
                return "vazio";
            }
            
        });
    }

}
