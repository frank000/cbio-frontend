import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { toggleAnimation } from 'src/app/shared/animations';
import { NgScrollbar } from 'ngx-scrollbar';
import { Store } from '@ngrx/store';
import { LoginService } from '../../../service/login.service';
import { WebSocketService } from '../../base/websocket/websocket-service.service'; 
import { AuthService } from 'src/app/service/auth.service';
import { WebsocketNotificationDTO } from 'src/app/shared/models/WebsocketNotificationDTO';
import { ChatSessionService } from 'src/app/service/chatsession.service';
import { colDef } from '@bhplugin/ng-datatable';
import { PhraseService } from 'src/app/service/phrase.service';
import { DiologService } from 'src/app/service/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { showMessage } from '../../base/showMessage';
import { SessionService } from 'src/app/service/session.service';
import Swal from 'sweetalert2';
import { AvatarUtil } from '../../base/avatar-util';
import { MediaService } from 'src/app/service/media.service';
import { catchError, map, Observable, of } from 'rxjs'; 
import { PrivateChannelService } from 'src/app/service/private-channel.service';
import { FileValidationException } from '../../base/FileValidationException';
import { ContactService } from 'src/app/service/contact.service';
import { IaService } from 'src/app/service/ia.service';


@Component({
    templateUrl: './chat.html',
    styleUrl: 'chat.css',
    animations: [toggleAnimation]
})
export class ChatComponent implements OnInit, OnDestroy{

    loginService = inject(LoginService);
    webSocketService = inject(WebSocketService);
    mediaService = inject(MediaService);
    authService = inject(AuthService);
    chatSessionService = inject(ChatSessionService);
    sessionService = inject(SessionService);
    diologService = inject(DiologService);
    userService = inject(UserService);
    privateChannelService = inject(PrivateChannelService);
    contactService = inject(ContactService);
    iaService = inject(IaService);

    userLocal:any;
    _fb = inject(FormBuilder);
    mask12 =  ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    imageTypes:string[] = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    documentTypes:string[] = ["text/plain", "application/pdf",
         "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/msword",
         "application/excel", ];

    loginUser:any;

    paramsEditUser!:  FormGroup;
    paramsContact!:  FormGroup;
    listChannelsIdsListen: string[] = []
    receivedMessages: string[] = [];

    bindScreen:number = 1;    
    iaTipText!:string;
    
    constructor(public storeData: Store<any>) {
        this.userLocal = this.authService.getObjectUserLogged();

        this.initStore();
        this.initGridPhrase();
        this.initForm();
      
        
        this.swalWithBootstrapButtons = Swal.mixin({
            buttonsStyling: false,
            customClass: {
                popup: 'sweet-alerts',
                confirmButton: 'btn btn-secondary',
                cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
            },
        });
        this.iaService.iaTipSubscription.subscribe((resp:any)=>{
            this.iaTipText = resp;
        });
    }

    ngOnInit(): void {
        this.userLocal = this.authService.getObjectUserLogged();
        // Conectamos ao WebSocket usando o Observable
        // Definindo um timeout para conectar ao WebSocket após 2 segundos
        setTimeout(() => {
            this.webSocketService.connectToObservable().subscribe(
            (resp: any) => {
                const topicAttendant = `/topic/demo.${this.userLocal.userId}`;
                console.log("Passo 1 - listen user ID", topicAttendant);
        
                this.subscribeToAttendantTopic(topicAttendant);
                console.log('Conexão estabelecida, agora vamos assinar os canais.');
            },
            (error) => {
                console.error('Erro ao conectar ao WebSocket:', error);
            }
            );
        }, 2000); // 2000 milissegundos = 2 segundos


        // Depois, obtemos todos os contatos e inscrevemos nos canais necessários
        this.reloadContactList();
        this.webSocketService.clearNotificationSubject.next(true)
  

        this.initListenWebsocketReload(); 
    }


    private initListenWebsocketReload() {
        this.webSocketService.connectToObservable().subscribe(
            (resp: any) => {
                const topicReload = `/topic/reload.${this.userLocal.userId}`;

                this.subscribeToReloadTopic(topicReload);
                console.log('Conexão estabelecida, agora vamos assinar os canais para RELOAD.');
            }
        );
    }

    /**
     * Função para garantir a inscrição no tópico individual do usuário.
     */
    subscribeToReloadTopic(topicReload: string): void {
        this.webSocketService.getMessages(topicReload).subscribe((message: any) => {
            this.reloadContactList();
            this.selectUser(this.selectedUser);
        });
    }
    
    /**
     * Carrega os contatos
     */ 
    private reloadContactList() {
 
        this.chatSessionService.getAll().subscribe(
            (resp: any) => {
                this.contactList = resp;
                console.log("Contatos carregados: ", this.contactList);


                
                let canais = this.contactList.map((item: any) => {
                    return {
                        path: `/topic/demo.${item.channelId}`,
                        channelId: item.channelId
                    };
                });

                // Inscrição nos canais relacionados aos contatos
                console.log("Canais:", canais);
                this.subscribeToChannels(canais);
          
            },
            (error) => {
                console.error('Erro ao carregar contatos:', error);
       

            }
        );
    }

    refreshContacts(){
        this.listChannelsIdsListen = []
        // this.selectedUser = null
        this.webSocketService.unsubscribeAllChannel();
        this.reloadContactList();
    }
    /**
     * Função para garantir a inscrição no tópico individual do usuário.
     */
    subscribeToAttendantTopic(topicAttendant: string): void {
        this.webSocketService.getMessages(topicAttendant).subscribe((message: any) => {
            console.log(`Mensagem recebida para o USUÁRIO ${topicAttendant}:`, message);
    
            let objCommingFromInit: WebsocketNotificationDTO = JSON.parse(message);
            this.updateContactList(objCommingFromInit);
    
            // Inscrição em canais individualmente
            if (!this.listChannelsIdsListen.includes(objCommingFromInit.channelId)) {
                this.listChannelsIdsListen.push(objCommingFromInit.channelId);
                this.subscribeIndividuallyChannel(objCommingFromInit.channelId, objCommingFromInit.userId, Math.random());
            }
        });
    }

    ngOnDestroy() {
        //this.webSocketService.disconnect();
    }

 
    /**
     * Atualiza a lista de contatos com base na mensagem recebida
     * @param objCommingFromInit 
     */
    private updateContactList(objCommingFromInit: WebsocketNotificationDTO) {
        const existingContact = this.contactList.find((item: any) => item.userId === objCommingFromInit.userId);

        if (existingContact) {
            // Atualiza o contato existente
            existingContact.preview = objCommingFromInit.preview;
            existingContact.time = objCommingFromInit.time;
            existingContact.active = true;
            console.log("Contato atualizado:", existingContact);
        } else {
            // Adiciona um novo contato
            this.contactList.push(objCommingFromInit);
            console.log("Novo contato adicionado:", objCommingFromInit);
        }
    }

    async subscribeToChannel(caminho: string) {
        try {
          await this.webSocketService.connect(); // Aguarda a conexão ser estabelecida
          console.log('Conexão estabelecida, agora vamos assinar os canais.xix');
      
          const subscriptio = this.webSocketService.getMessages(caminho).subscribe((message:any) => {
            console.log(`Mensagem recebida no canal ${caminho}:`, message);
            this.addMensagemReceivedToSelectedUser(message.channelId, message);

          });
          this.webSocketService.subscribeListPath[caminho] = subscriptio;
          console.log(`Inscrição bem-sucedida no canal: ${caminho}`);
        } catch (error) {
          console.error('Erro ao conectar ao WebSocket:', error);
        }
    }


    async subscribeToChannels(canais: any[]) {
        try {
            await this.webSocketService.connect(); // Aguarda a conexão ser estabelecida
            console.log('Conexão estabelecida, agora vamos assinar os canais.');
    
            // Loop para processar cada canal
            for (const canal of canais) {
                console.log(`Subs in ${canal.path}:`);
    
                // Verifica se já existe uma inscrição e cancela se necessário
                const existingSubscription = this.webSocketService.subscribeListPath[canal.path];
                if (existingSubscription) {
                    console.log(`Cancelando inscrição antiga no canal: ${canal.path}`);
                    existingSubscription.unsubscribe(); // Cancela a inscrição antiga
                    delete this.webSocketService.subscribeListPath[canal.path]; // Remove a referência
                }
    
                // Inscreve-se no novo canal
                const subscription = this.webSocketService.getMessages(canal.path).subscribe((message: any) => {
                    console.log(`Mensagem recebida no canal ${canal.channelId}:`, message);
                    this.addMensagemReceivedToSelectedUser(canal.channelId, message);
                });
    
                // Armazena a nova inscrição na lista de inscrições
                this.webSocketService.subscribeListPath[canal.path] = subscription;
                console.log(`Inscrição bem-sucedida no canal: ${canal.path}`);
            }
        } catch (error) {
            console.error('Erro ao conectar ao WebSocket:', error);
        }
    }
 

    store: any;
    private subscribeIndividuallyChannel(channelId:any,  userId:any, index:number) { 

        this.listenOneTopicWebsocket(channelId, index);
    }
    


    private listenOneTopicWebsocket(channelId: any, index:number) {
        let service = this.webSocketService;
        const path = "/topic/demo." + channelId;

        this.subscribeToChannel(path)
    }



    private addMensagemReceivedToSelectedUser(channelIdListened: any, subMessage: string) {
 
        
        // Parse da mensagem recebida
        let parsedMessage = JSON.parse(subMessage);
       
        
        // Verifica se a mensagem possui um identificador único (assumindo que existe um campo 'id' na mensagem)
        const messageId = parsedMessage.id;
        channelIdListened = parsedMessage.channelId 
        // Filtra o contato correspondente ao canal
        const contact = this.contactList.find((item: any) => item.channelId === channelIdListened);
    
        if (contact) {  
            
            let selectedUserChannel:any = localStorage.getItem("selectedUserChannel");
 
            // Somente adiciona se o usuário selecionado for o mesmo do contato encontrado
 
            if (selectedUserChannel === contact.channelId) {
      
                // Inicializa a lista de mensagens se não existir
                if (!contact.messages) {
                    contact.messages = [];
                }
                if(parsedMessage.media != null){
                    this.getMediaByDialog(parsedMessage)
                    .subscribe();
                }
 
    
                // Verifica se a mensagem já existe na lista
                const exists = contact.messages.some((msg: any) => msg.id === messageId);
                if (!exists) {
                    contact.messages.push(parsedMessage); // Adiciona a mensagem apenas se não existir
                    console.log("Mensagem adicionada:", parsedMessage);
                } else {
                    console.log("Mensagem duplicada, não adicionada:", parsedMessage);
                }
                
                this.scrollToBottom();
            }
        }
    
    }
 
    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            }); 
        
        this.loginUser = {
            id: 0,
            name: this.userLocal.name,
            path: 'profile-34.jpeg',
            designation: 'Software Developer',
        };
    }

    @ViewChild('scrollable') scrollable!: NgScrollbar;
    isShowUserChat:boolean[] = [];
    isShowChatMenu = false;

    contactList: WebsocketNotificationDTO[] = [
        
    ];
    searchUser = '';
    searchMessage = '';
    searchPhraseField = '';
    searchContactField = '';
    textMessage = '';
    selectedUser: any = null;

    searchUsers() {
        return this.contactList
        .filter((d: { name: string, identificadorRemetente:string, cpf:string }) => {
            if(d.name != null){
                return d.name.toLowerCase().includes(this.searchUser) ||
                d.identificadorRemetente.toLowerCase().includes(this.searchUser) ||
                d.cpf.toLowerCase().includes(this.searchUser);
            }else{
                return "Cliente";
            }
            
        });
    }


    searchMessages() {
        return this.selectedUser.messages
        .filter((d: { text: string }) => {
            if(d.text != null){
                return d.text.toLowerCase().includes(this.searchMessage);
            }else{
                return "Cliente";
            }
            
        });
    }



    selectUser(user: any) { 
        
        this.selectedUser = user;
        this.isShowUserChat = [];
        this.isShowUserChat[user.channelId] = true;
        this.scrollToBottom();
        this.isShowChatMenu = false; 
        

        this.textMessage = "";

        if(this.selectedUser.channelId != undefined){
            this.listAllMessagesBySender();
        }
        localStorage.setItem("selectedUserChannel", this.selectedUser.channelId);        
    }

    isEditContactOnly = true;
    getContactOpenModal(contactId:string, modal:any){
        this.contactService.obtem(contactId)
        .subscribe(
            (resp:any)=>{
              this.isEditContactOnly = false;  
              this.bindScreen = 2;// edit contact screen
              this.paramsContact.patchValue(resp);
              modal.open();
            }
        );
    }


    private listAllMessagesBySender() {
        this.diologService.getAllBySender(this.selectedUser.userId, this.selectedUser.channelId)
            .subscribe(
                (resp: any) => {
                    this.selectedUser.messages = resp;
                    this.selectedUser.messages
                        .filter((msg: any) => msg.media != null)
                        .map((msg: any) => {
                            this.getMediaByDialog(msg)
                                .subscribe(); // Certifique-se de se inscrever para que a requisição seja feita
                        });

                    this.scrollToBottom();

                },
                (error: any) => {
                    console.error('Erro ao buscar mensagens:', error);
                }
            );
    }

    private getMediaByDialog(msg: any) :any{


        if(msg.url != null && msg.url != ""){
            return msg.body = msg.url;//messages from IG
        }else{

            return this.getMedia(msg.id)
            .pipe(
                map((mediaResp: any) => {
        
                    if(mediaResp != undefined){
                        msg.body = mediaResp; // Atualiza o corpo da mensagem com a mídia
                    }else{
                        msg.body = "/assets/images/naodisponivel.png" 
                    }
                })
            );
        }
 


    }

    sendMessage(channelId:any) {
        if (this.textMessage.trim()) {
            const user: any = this.contactList.find((d: { userId: any }) => d.userId === this.selectedUser.userId);
 
            const menssage = {
                fromUserId:  this.selectedUser.userId,//valor é a sessao
                toUserId: this.userLocal.userId,
                text: this.textMessage,
                type: "TEXT",
                time: 'Just now',
            };

            // if(user.messages==null){    
            //     user.messages = [menssage];
            // }else{
            //     user.messages.push(menssage);    
            // }
            
            this.scrollToBottom();
            this.sender(channelId, menssage);


            this.textMessage = '';



            this.scrollToBottom();
        }
    }


    scrollToBottom() {
        if (this.isShowUserChat[this.selectedUser.channelId]) {
            setTimeout(() => {
                this.scrollable.scrollTo({ bottom: 0 });
            });
        }
    }
    isShowUserChatFunc(){
        if(this.selectedUser != null && this.selectedUser.channelId != null){
            return this.isShowUserChat[this.selectedUser.channelId]
        }else{
            return false;
        }
    }

    getInitialCharacters(nameParam:any = null){
        let name = (nameParam != null)? nameParam : this.userLocal.name; 
        
        if(name == null){
            name = this.userLocal.preferred_username.split("@")[0]
        }
        return AvatarUtil.getInitialCharacters(name);
    }

    openModelEdit(modalEditUser:any){
        this.paramsEditUser.patchValue({
            name:this.selectedUser.name,
            cpf:this.selectedUser.cpf
        }); 

        modalEditUser.open();

    }

    sender(channelId:any, menssage:any){ 
        this.webSocketService.sendMessage(   '/app/demo.'+channelId , menssage);
      }


    //   modal phrase

    gridRowsPhrase:any[] = [];
    colsPhrase: Array<colDef> = [];
    colsContacts: Array<colDef> = [];
    totalRowsUser!:number  

    _phraseService = inject(PhraseService);
    initGridPhrase(){
        this.colsPhrase = [ 
            { field: "description", title: "Descrição" },      
            { field: "acoes", title: "Ações" }
          ];
          
        this.colsContacts = [ 
            { field: "name", title: "Nome" },      
            { field: "phone", title: "Telefone" },      
            { field: "acoes", title: "Ações" }
          ];

        this._phraseService.getAll()
        .subscribe(
            (resp:any)=>{
                this.gridRowsPhrase = resp;
            }
        );
    }

    files(file:any){
        file.click();
    }

    fileName = '';
    onFileSelected(event?:any){
        const file:File = event.target.files[0];

        if (file) {

            try{
                this.validateFileSize(file);

                const menssage = {
                    fromUserId:  this.selectedUser.userId,//valor é a sessao
                    toUserId: this.userLocal.userId,
                    text: null,
                    type: this.getTipeFile(file),
                    time: 'Just now',
                    channelId: this.selectedUser.channelId
                };
                  
                this.fileName = file.name; 
                
                this.privateChannelService.sendFile(file, JSON.stringify(menssage))
                .subscribe((resp:any)=>{
                    console.log(resp);
                    
                });


            }catch (error) {
                if (error instanceof FileValidationException) {
                    showMessage(error.message, 'error');
                } else {
                  console.error('Erro inesperado:', error);
                }
              }

            
        }
    }

    private getTipeFile(file:File) { 
        
        if(this.imageTypes.includes(file.type)){
            return "IMAGE";
        }else if(this.documentTypes.includes(file.type)){
            return "DOCUMENT";
        }else{
            return "TEXT"
        }
     
    }

    private validateFileSize(file:File) { 


        if(this.imageTypes.includes(file.type)){
            const maxSizeInMB = 16;
            const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

            if(file.size > maxSizeInBytes){
                    throw new FileValidationException(`O arquivo excede o tamanho máximo de ${maxSizeInMB} MB.`);
            }
        }else if(this.documentTypes.includes(file.type)){
            const maxSizeInMB = 100;
            const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
            if(file.size > maxSizeInBytes){
                throw new FileValidationException(`O arquivo excede o tamanho máximo de ${maxSizeInMB} MB.`);
            }
        }
     
    }

    selectPhrase(value:any, model:any){
        this.textMessage = value
        model.close()
    }

    selectPhraseRow(event:any, model:any){
        this.textMessage = event.description
        model.close()
    }
    selectTip(modal:any){
        if(this.selectedUser.active){
            this.textMessage = this.iaTipText;
            modal.close()
        }
      
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

    initForm(){
        this.paramsEditUser = this._fb.group({
        
            name: [''],
            cpf: [''], 
            telefone1: [''],
            telefone2: [''],
            email: ['']
        });
        this.paramsContact = this._fb.group({
            id: [null],
            name: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            phone: ['', Validators.required],
            location: [''],
            obs: [''],
        });
    }

    onEditUser(modal:any){
        this.selectedUser.name = this.paramsEditUser.controls["name"].value;
        this.selectedUser.userId;
        this.userService.updateSession(
            this.selectedUser.userId,
            {
                name:this.selectedUser.name,
                cpf:this.paramsEditUser.controls["cpf"].value,
                telefone1:this.paramsEditUser.controls["telefone1"].value,
                telefone2:this.paramsEditUser.controls["telefone2"].value,
                email:this.paramsEditUser.controls["email"].value,
            }
        )
        .subscribe(
            (resp:any)=>{
                this.selectedUser.cpf = this.paramsEditUser.controls["cpf"].value;
                this.selectedUser.telefone1 = this.paramsEditUser.controls["telefone1"].value;
                this.selectedUser.telefone2 = this.paramsEditUser.controls["telefone2"].value;
                this.selectedUser.email = this.paramsEditUser.controls["email"].value;
                showMessage('Cadastro atualizado com sucesso.');
                
                modal.close()
            }
        )
    }

    disconnectAttendance(user:any){

        this.swalWithBootstrapButtons
        .fire({
            title: 'Tem certeza que deseja fechar o atendimento?',
            text: "Quando você fecha o atendimento o usuário consegue comunicar apenas com o Bot automatizado.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            reverseButtons: true,
            padding: '2em',
        })
        .then((result:any) => {
            if (result.value) {
                this.sessionService.disconnctAttendance(user.channelId)
                .subscribe((resp:any)=>{
                    showMessage("Atendimento fechado com sucesso.")
                    this.selectedUser.active = false;
                })
            }  
        });

 
        
        
    }

    swalWithBootstrapButtons:any;
    connectAttendance(user:any){
 
        this.swalWithBootstrapButtons
        .fire({
            title: 'Tem certeza que deseja abrir o atendimento?',
            text: "Quando você abre o atendimento o usuário não consegue comunicar com o Bot automatizado enquanto não for fechado novamente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            reverseButtons: true,
            padding: '2em',
        })
        .then((result:any) => {
            if (result.value) {
                this.sessionService.connectAttendance(user.channelId)
                .subscribe((resp:any)=>{
                    showMessage("Atendimento aberto com sucesso.")
                    this.selectedUser.active = true;
                })  
            }  
        });
    }

    isShowFieldSearch:boolean = false;
    showSearchField(){
        this.isShowFieldSearch = !this.isShowFieldSearch;
    }


    getMedia(dialogId: string): Observable<any> {
        return this.mediaService.getMedia(dialogId,).pipe(
            map((resp: any) => { 
                // Aqui você pode formatar a resposta caso necessário
                return resp; // Retorna a resposta em caso de sucesso
            }),
            catchError((error: any) => {
                console.log(error);
                return of(" - "); // Retorna valor padrão em caso de erro
            })
        );
    }


    searchAllContacts(){
        this.contactService.getAll()
        .subscribe(
            (resp:any) =>{ 
                this.filterdContactsList = resp;
            }
        );        
    }

    filterdContactsList: any = [];
    searchContacts() {
        return this.filterdContactsList.filter((d:any) => d.name.toLowerCase().includes(this.searchContactField.toLowerCase()));
        
    }

    openBindContact(modalBindContact:any){
        this.searchAllContacts();

        modalBindContact.open();

    }
    addContact(){
        this.bindScreen = 2;

    }

    backContact(){
        this.searchAllContacts();
        this.bindScreen = 1;
        this.paramsContact.reset();
    }

    submitContact(modal:any){
        if (this.paramsContact.controls['name'].errors) {
            showMessage('Nome é obrigatório.', 'error');
            return;
        }
        if (this.paramsContact.controls['email'].errors) {
            showMessage('Email é obrigatório.', 'error');
            return;
        }
        if (this.paramsContact.controls['phone'].errors) {
            showMessage('Celular é obrigatório.', 'error');
            return;
        }
      
        let user = { 
            path: null,
            name: this.paramsContact.value.name,
            email: this.paramsContact.value.email, 
            phone: this.paramsContact.value.phone,
            location: this.paramsContact.value.location,
            obs: this.paramsContact.value.obs,

        };
     
        // this.contactList.splice(0, 0, user);
        this.searchContacts();

        this.contactService.save(user).subscribe(
            (resp:any) =>{
                showMessage('Contato salvo com sucesso!');
                modal.close();
                this.searchAllContacts()
                this.backContact();
            }
        );
    }

    bindContact(value:any, modalBindContact:any){
        this.selectedUser.contact = {
            id:value.id,
            name:value.name,
            email:value.email
        };
        this.userService.bindContact(
            this.selectedUser.userId,
            this.selectedUser.contact
        )
        .subscribe(
            (resp:any)=>{
                showMessage("Contato vinculado com sucesso.");
                modalBindContact.close();
                this.selectedUser.name = value.name;
                this.paramsEditUser.controls["name"].setValue(value.name);
                this.paramsEditUser.controls["email"].setValue(value.email);
            }
        );
        
  
    }
}
