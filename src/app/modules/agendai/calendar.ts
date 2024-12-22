import { Component, inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { toggleAnimation } from 'src/app/shared/animations';
import Swal from 'sweetalert2';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ContactService } from 'src/app/service/contact.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

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
    myControl = new FormControl(''); 
    filteredOptions!: Observable<any>;


    events: any = [];
    calendarOptions: any;
    companyService: CompanyService = inject(CompanyService);
    resourceService: ResourceService = inject( ResourceService);
    googleService: GoogleCalendarService = inject(GoogleCalendarService);
    contactsService: ContactService = inject(ContactService);
    service: Service = inject(Service);
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
    
    totalContactsSearched:null|number = null; 
    
    private _filterContacts(value: string) {
        // Garantir que o valor seja uma string
        const filterValue = value ? value.toLowerCase() : '';
        let query = new HttpParams();
        query = query.append('filter', filterValue);
      
        return this.contactsService.obtemGrid(query)
          .pipe(
            filter(data => !!data),  // Verifica se os dados existem
            map((data) => {
              // Se os dados estiverem presentes, realiza o filtro
              this.totalContactsSearched = data.total;
      
              // Filtra os itens com base no nome
              return data.items.filter((option: any) => {
                // Garante que 'name' exista e seja uma string
                return option.name && option.name.toLowerCase().includes(filterValue);
              });
            })
          );
      }
      

    ngOnInit() {
        this.getEvents();

        this.initFieldContatcs();

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

    private initFieldContatcs() {
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                filter((value: any) => typeof value === 'string' && value.length > 3),
                switchMap(value => this._filterContacts(value))
            );
    }
    
    selectedContact:any;

    changeContacts(option: any){
        this.selectedContact = option;  
        this.params.controls['name'].setValue(this.selectedContact.name);
        this.params.controls['phone'].setValue(this.selectedContact.phone);
        this.params.controls['email'].setValue(this.selectedContact.email);
        this.params.controls['contactId'].setValue(this.selectedContact.id); 
        
    }


    initForm() {
        this.params = this.fb.group({
            id: null,
            title: ['', Validators.required],
            start: ['', Validators.required],
            end: ['', Validators.required],
            name: [''],
            startFormated: [''],
            endFormated: [''],
            phone: [''],
            email: [''],
            description: [''],
            dairyName:['' ],
            type: ['primary'],
            contactId:[null]
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
 
    hoursList!:any[];
    changedDate(event:any){
        console.log(event);
        console.log(this.dateScheduleList[event]); 
        this.hoursList = this.dateScheduleList[event];
    }
    changedHour(event:any){
        console.log(event);
        console.log(this.dateScheduleList[event]); 
        this.hoursList = this.dateScheduleList[event];
        this.params.controls['end'].setValue(event.strEndDateTime);
    }

 
      getOrdenedScheduleList(dateScheduleList:any) {
        // Ordena as chaves do objeto convertendo para objetos Date
        const chavesOrdenadas = Object.keys(dateScheduleList).sort((a, b) => {
          // Convertendo as chaves de data para o formato Date
          const dataA:any = new Date(a.split('/').reverse().join('-'));  // Converte 'dd/MM/yyyy' para 'yyyy-MM-dd'
          const dataB:any = new Date(b.split('/').reverse().join('-'));  // Converte 'dd/MM/yyyy' para 'yyyy-MM-dd'
      
          return dataA - dataB;  // Compara as datas
        });
        this.dateKeys = chavesOrdenadas;
      
 
        return dateScheduleList;
      }


    dateScheduleList!:any[] ;
    dateKeys!:string[] ;
    key!:string;

    changeDairyName(event:any){ 
        
        this.params.controls['description'].setValue(event.description);
        this.params.controls['title'].setValue(event.title);

        this.rangeDateViewCalendar.resourceId = event.id;
        this.googleService.getScheduleByResourceId(this.rangeDateViewCalendar)
        .subscribe(
            (scheduleList:any) => {
                this.dateScheduleList = this.getOrdenedScheduleList(scheduleList) ;
 
                // eventList.forEach(
                //     (item:any)=> this.calendarOptions.events.push(item)
                // );
                
            }
        );
    }

    isNewEvent:boolean = false
    editEvent(data: any = null) {
         
        this.params = JSON.parse(JSON.stringify(this.defaultParams));

        this.isAddEventModal.open();
        this.initForm();

        if (data) {
 
            let obj = JSON.parse(JSON.stringify(data.event));
             console.log(obj);
             
            this.params.setValue({
                id: obj.id ? obj.id : null,
                title: obj.title ? obj.title : null,
                start: this.dateFormat(obj.start),
                end: this.dateFormat(obj.end),
                startFormated: this.dateBrazilianFormat(obj.start),
                endFormated: this.dateBrazilianFormat(obj.end),
                type: obj.classNames ? obj.classNames[0] : 'primary',
                description: obj.extendedProps ? obj.extendedProps.description : '',
                dairyName: obj.extendedProps ? obj.extendedProps.dairyName : '',
                name: obj.extendedProps ? obj.extendedProps.name : '',
                phone: obj.extendedProps ? obj.extendedProps.phone : '',
                email: obj.extendedProps ? obj.extendedProps.email : '',
                contactId: obj.extendedProps ? obj.extendedProps.contactId : null,
            });
            this.myControl.setValue(this.params.value.name);
            this.isNewEvent = true
            this.minEndDate = new Date();

 
             this.minEndDate = this.dateFormat(obj.start); 


        } else {
            this.minEndDate = new Date();
 


            this.minStartDate = new Date();


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

    dateBrazilianFormat(dt: any) {
        dt = new Date(dt);
        const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
        const date = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
        const hours = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours();
        const mins = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes();
        dt = date + "/" + month + "/" + dt.getFullYear() +  ' ' + hours + ':' + mins;
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
       
        if(this.params.value.name == null || this.params.value.name == ''){
            console.log(this.myControl.value);
            
            this.params.controls['name'].setValue(this.myControl.value);
        }
        

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
            event.contactId = this.params.value.contactId;


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
                email: this.params.value.email,
                contactId: this.params.value.contactId
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

@Injectable({
    providedIn: 'root'
  })
  export class Service {
    constructor(private http: HttpClient) { }
  
    opts = [];
  
    getData() {
      return of([{ companyName: "minus", cid: "524023240" },
      { companyName: "plus sim", cid: "524023240" }])
    }
  }