import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { toggleAnimation } from 'src/app/shared/animations';
import Swal from 'sweetalert2';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Store } from '@ngrx/store';
import { CompanyService } from 'src/app/service/company.service';
import { GoogleCalendarService } from 'src/app/service/google-calendar.service';
import { CompanyConfig, GoogleCredentialDTO } from '../base/companyConfig';
import ptBrLocale from '@fullcalendar/core/locales/pt-br'; // Importando o idioma que você deseja
import { ResourceService } from 'src/app/service/resource.service';
import { DatePipe } from '@angular/common';
import { showMessage } from '../base/showMessage';

const FILTER_RESOURCE = "filter_resource";
@Component({
    templateUrl: './calendar.html',
    animations: [toggleAnimation],
    styleUrl: './calendar.css'
})
export class CalendarComponent implements OnInit {
    store: any;
    isLoading = true;
    @ViewChild('isAddEventModal') isAddEventModal!: NgxCustomModalComponent;
    @ViewChild('isAddConfigModal') isAddConfigModal!: NgxCustomModalComponent;
    @ViewChild('isAddResourceModal') isAddResourceModal!: NgxCustomModalComponent;
    @ViewChild('calendar') calendar!: FullCalendarComponent;
    defaultParams = {
        id: null,
        title: '',
        start: '',
        end: '',
        description: '',
        type: 'primary',
        dairyName: ''
    };
    params!: FormGroup;
    paramsNotify!: FormGroup;
    paramsConfig!: FormGroup;
    minStartDate: any = '';
    minEndDate: any = '';
    selectedResourceFilter:any; 

    events: any = [];
    calendarOptions: any;
    companyService: CompanyService = inject(CompanyService);
    resourceService: ResourceService = inject( ResourceService);
    googleService: GoogleCalendarService = inject(GoogleCalendarService);
    datePipe: DatePipe  = inject(DatePipe)
    isSynced:boolean = false;
    optionsFilter:any[] = [];
    rangeDateViewCalendar:any;
    mask12 =  ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    constructor(
        public fb: FormBuilder,
        public storeData: Store<any>,
    ) {
        this.initForm();
        this.initStore();
        this.isLoading = false;
      

    }


    initData(){
        this.resourceService.getResourceListFilter()
        .subscribe(
            (list:any)=>{
                this.optionsFilter = list;
        
            }
        )
    }
    async initStore() {
        this.storeData
            .select((d: any) => d.index)
            .subscribe((d: any) => {
                const hasChangeLayout = this.store?.layout !== d?.layout;
                const hasChangeMenu = this.store?.menu !== d?.menu;
                const hasChangeSidebar = this.store?.sidebar !== d?.sidebar;

                this.store = d;

                if (hasChangeLayout || hasChangeMenu || hasChangeSidebar) {
                    if (this.isLoading) {
                        this.initCalendar();
                        this.calendarOptions.events = [];
                    } else {
                        setTimeout(() => {
                            this.initCalendar();
                        }, 300);
                    }
                }
            });
    }

    initCalendar() {
        this.calendarOptions = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialView: 'dayGridMonth',
            locales: [ptBrLocale],
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
            },
            editable: false,
            dayMaxEvents: true,
            selectable: true,
            droppable: false,
            eventClick: (event: any) => {
                this.editEvent(event);
            },
            select: (event: any) => {
                this.editDate(event);
            },
            datesSet: this.onDatesSet.bind(this) // Chamando a função onDatesSet quando as datas são alteradas

        };
    }
    onDatesSet(arg: any) {
    
        this.rangeDateViewCalendar = arg;

        if(this.selectedResourceFilter != null){
            this.changeFilterResource(this.selectedResourceFilter);

        }else{
            this.showMessage("Selecione o/os recursos.", 'warning')
        }

    }

    ngOnInit() {
        this.getEvents();

        this.companyService.getConfigByCompany()
        .subscribe(
            (resp:any) =>{
                this.configCompany = resp;       
                this.params.patchValue(this.configCompany);
            }
        );


        this.companyService.hasCredential()
        .subscribe(
            (resp:any) =>{
                this.isSynced = resp;
            }
        );
        this.initData();

        this.swalWithBootstrapButtons = Swal.mixin({
            buttonsStyling: false,
            customClass: {
                popup: 'sweet-alerts',
                confirmButton: 'btn btn-secondary',
                cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
            },
          });
    }

    initForm() {
        this.params = this.fb.group({
            id: null,
            title: ['', Validators.required],
            start: ['', Validators.required],
            end: ['', Validators.required],
            name: [''],
            phone: [''],
            email: [''],
            description: [''],
            dairyName:['' ],
            type: ['primary'],
        });
        this.paramsConfig = this.fb.group({
            id: null,
            emailCalendar: ['', Validators.required],
            googleClientId: ['', Validators.required], 
            googleClientSecret: ['', Validators.required], 
 
        });
    }

    getEvents() {
        const now = new Date();
        this.events = []; 
        
        this.calendarOptions.events = this.events;
    }

    getMonth(dt: Date, add: number = 0) {
        let month = dt.getMonth() + 1 + add;
        const str = (month < 10 ? '0' + month : month).toString();
        return str;
    }
    
    modalResource(data: any = null) {
        this.isAddResourceModal.open();
    }
    sync(){
        if(this.configCompany.emailCalendar != null){
            this.googleService.getAuthorize(this.configCompany.emailCalendar)
            .subscribe(
                (resp:any)=>{ 
                    if(resp.url != null){
                        window.location = resp.url;
                    }
                }
            );
        }else{
            window.location.reload()
        }

    }

    configCompany!:CompanyConfig;

    editConfig(data: any = null) {
        this.companyService.getConfigByCompany()
        .subscribe(
            (resp:any) =>{
                this.configCompany = resp;
               this.isAddConfigModal.open();
                this.paramsConfig.patchValue(this.configCompany);

                this.paramsConfig.controls['googleClientId'].setValue(this.configCompany.googleCredential.clientId)
                this.paramsConfig.controls['googleClientSecret'].setValue(this.configCompany.googleCredential.clientSecret)
 
            }
        );
        this.isAddConfigModal.open();
    }
    saveConfig(){
        let data:CompanyConfig = this.paramsConfig.getRawValue() as CompanyConfig;

        let credential: GoogleCredentialDTO = {
            clientId : this.paramsConfig.controls['googleClientId'].value,
            clientSecret : this.paramsConfig.controls['googleClientSecret'].value
        } as GoogleCredentialDTO;


        data.googleCredential = credential;
  
        this.companyService.saveConfig(data)
        .subscribe(
            (resp:any)=>{
                this.isAddConfigModal.close();
                this.showMessage("Configuração salva com sucesso.")
                this.changeFilterResource(null);
            }
        )
    }
 
    changeDairyName(event:any){ 
        
        this.params.controls['description'].setValue(event.description);
        this.params.controls['title'].setValue(event.title);
    }

    isNewEvent:boolean = false
    editEvent(data: any = null) {
         
        this.params = JSON.parse(JSON.stringify(this.defaultParams));

        this.isAddEventModal.open();
        this.initForm();

        if (data) {
 
            let obj = JSON.parse(JSON.stringify(data.event));
    
            this.params.setValue({
                id: obj.id ? obj.id : null,
                title: obj.title ? obj.title : null,
                start: this.dateFormat(obj.start),
                end: this.dateFormat(obj.end),
                type: obj.classNames ? obj.classNames[0] : 'primary',
                description: obj.extendedProps ? obj.extendedProps.description : '',
                dairyName: obj.extendedProps ? obj.extendedProps.dairyName : '',
                name: obj.extendedProps ? obj.extendedProps.name : '',
                phone: obj.extendedProps ? obj.extendedProps.phone : '',
                email: obj.extendedProps ? obj.extendedProps.email : '',
            });
            this.isNewEvent = true
            this.minStartDate = new Date();
            this.minEndDate = this.dateFormat(obj.start); 


        } else {
            this.minStartDate = new Date();
            this.minEndDate = new Date();


        }
    }

    editDate(data: any) {
        let obj = {
            event: {
                start: data.start,
                end: data.end,
            },
        };
        this.editEvent(obj);
    }

    dateFormat(dt: any) {
        dt = new Date(dt);
        const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
        const date = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
        const hours = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours();
        const mins = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes();
        dt = dt.getFullYear() + '-' + month + '-' + date + 'T' + hours + ':' + mins;
        return dt;
    }

    notifyEvent(){
        if (!this.params.value.phone) {
            showMessage("Celular não informado.","error");
        }else{

            let event = this.calendarOptions.events.find((d: any) => d.id == this.params.value.id);


            this.googleService.notify(event)
            .subscribe(
                (resp:any) =>{
                    showMessage("Notificação enviada.");
                }
            );
        }
    }


    swalWithBootstrapButtons:any
    deleteEvent(){
 
        this.swalWithBootstrapButtons
        .fire({
            title: 'Tem certeza que deseja excluir o evento?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            reverseButtons: true,
            padding: '2em',
        })
        .then((result:any) => {
            if (result.value) {
                this.googleService.deleteEvent(this.params.value.id, {          dairyName: this.params.value.dairyName })
                .subscribe(
                    (resp:any)=>{ 
                        this.isAddEventModal.close();
                        this.showMessage("Evento deletado com sucesso.")
                        this.changeFilterResource(null);
                        
                    }
                );
            }  
        });
    

        
        
    }

    saveEvent() {
        if (!this.params.value.title) {
            return;
        }
        if (!this.params.value.start) {
            return;
        }
        if (!this.params.value.end) {
            return;
        }
        if (!this.params.value.dairyName) {
            return;
        }

    
        if (!this.params.value.phone || !this.params.value.email) {
            let fileds:string[] = [];
           
            if(!this.params.value.phone){
                fileds.push("celular");
            }
           
            if(!this.params.value.email){
                fileds.push("e-mail");
            }
            let fieldsJoin:any = "";

            if(fileds.length == 1){
                fieldsJoin = fileds.pop();
            }else if(fileds.length > 1){
                fieldsJoin  = fileds.join(" e ");

            }
            this.swalWithBootstrapButtons
            .fire({
                title: `Tem certeza que deseja salvar sem ${fieldsJoin}?`,
                text: `O campo  ${fieldsJoin} é importante para notificar o usuário.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
                reverseButtons: true,
                padding: '2em',
            })
            .then((result:any) => {
                if(result.isConfirmed){
                    this.saveEventProcess();
                } 
                
               
            });
        }else{
            this.saveEventProcess();
        }



        
    }
          
 

    private saveEventProcess() {
        const dateStart = new Date(this.params.value.start); // exemplo de data

        const timezoneOffset = -dateStart.getTimezoneOffset();
        const hours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
        const minutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
        const offset = `${timezoneOffset >= 0 ? '+' : '-'}${hours}:${minutes}`;


        const formattedDateStart = this.params.value.start + ":00" + offset; // formato ISO com fuso horário


        const formattedDateEnd = this.params.value.end + ":00" + offset; // formato ISO com fuso horário

        if (this.params.value.id) {
            //update event
            let event = this.calendarOptions.events.find((d: any) => d.id == this.params.value.id);


            event.title = this.params.controls['title'].value;
            event.start = formattedDateStart;
            event.end = formattedDateEnd;
            event.description = this.params.controls['description'].value;
            event.className = this.params.controls['type'].value;
            event.dairyName = this.params.value.dairyName;
            event.name = this.params.value.name;
            event.phone = this.params.value.phone;
            event.email = this.params.value.email;


            this.googleService.updateEvent(this.params.value.id, event)
                .subscribe(
                    (resp: any) => {
                        this.showMessage("Evento alterado com sucesso.");
                        this.changeFilterResource(null);
                    }
                );
        } else {
            //add event
            let maxEventId = 0;
            if (this.events && this.events.length > 0) {
                maxEventId = this.events.reduce((max: number, character: any) => (character.id > max ? character.id : max), this.events[0].id);
            }

            let event = {
                id: maxEventId + 1,
                title: this.params.value.title,
                start: formattedDateStart,
                end: formattedDateEnd,
                description: this.params.value.description,
                dairyName: this.params.value.dairyName,
                name: this.params.value.name,
                phone: this.params.value.phone,
                email: this.params.value.email
            };
            this.events.push(event);
            this.googleService.insert(event)
                .subscribe(
                    (resp: any) => {
                        this.changeFilterResource(null);
                    }
                );
        }
        this.calendar.getApi(); //refresh Calendar

        // this.showMessage('Event has been saved successfully.');
        this.isAddEventModal.close();
    }

    showMessage(msg = '', type = 'success') {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    }

    changeFilterResource(event:any[] | null){
        if(event!= null){            
          this.selectedResourceFilter = event;
          localStorage.setItem(FILTER_RESOURCE , this.selectedResourceFilter);
        }else{
            localStorage.removeItem(FILTER_RESOURCE)
        }
 
        this.calendarOptions.events = [];
        this.selectedResourceFilter.forEach(
            (item:any)=>{
                this.rangeDateViewCalendar.resourceId = item.id;
                this.googleService.getEventsByResourceId(this.rangeDateViewCalendar)
                .subscribe(
                    (eventList:any) => { 
                        eventList.forEach(
                            (item:any)=> this.calendarOptions.events.push(item)
                        );
                        
                    }
                );
            }
        )
 
        
    }



}