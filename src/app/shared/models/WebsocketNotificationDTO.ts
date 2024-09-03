export interface WebsocketNotificationDTO{

    userId: string;

    channelId: string;

    name: string;

    path: string;

    time: string;

    preview: string;

    messages: any[];

    active: boolean;
}