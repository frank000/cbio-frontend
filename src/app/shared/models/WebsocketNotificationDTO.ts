export interface WebsocketNotificationDTO{

    userId: string;

    channelId: string;

    name: string;
    cpf: string;
    
    nameCanal: string;
    
    identificadorRemetente: string;

    path: string;

    time: string;

    preview: string;

    messages: any[];

    active: boolean;
}