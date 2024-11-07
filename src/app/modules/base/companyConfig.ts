export interface CompanyConfig{

    id:string;
    keepSameAttendant:boolean;
    emailCalendar:string;
    companyId:string;
    googleCredential:GoogleCredentialDTO;
}

export interface GoogleCredentialDTO{
    clientId:string;
    clientSecret:string;
}

 