import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FlatpickrDefaultsInterface } from 'angularx-flatpickr';
import { showMessage } from 'src/app/modules/base/showMessage';
import { BtnSalvaVoltaComponent } from 'src/app/modules/common/btn-salva-volta/btn-salva-volta.component';
import { MessageService } from 'src/app/service/message.service';
import { ResourceService } from 'src/app/service/resource.service';
import { TemplateService } from 'src/app/service/template.service';
import { Message } from 'src/app/shared/models/message';
import { NotificationDTO } from 'src/app/shared/models/notification';
import { SharedModule } from 'src/shared.module';

@Component({
  selector: 'app-form-recurso',
  standalone: true,
  imports: [CommonModule, SharedModule, BtnSalvaVoltaComponent],
  templateUrl: './form-recurso.component.html',
  styleUrl: './form-recurso.component.css'
})
export class FormRecursoComponent implements OnInit{
  _fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  _messageService = inject(MessageService);
  _templateService = inject(TemplateService);
  _resourceService = inject(ResourceService);
  params!: FormGroup;
  paramsDates!: FormGroup;
  paramsNotification!: FormGroup;
  id:any;
  morningCheck:boolean = false;
  afternoonCheck:boolean = false;
  nightCheck:boolean = false;
  dawnCheck:boolean = false;
  preloadingTime: FlatpickrDefaultsInterface;
  selectedResource!:any;
  daysOfWeek: any[] = [
    {
      id:1,
      checked: false,
      label:'Seg',
    },
    {
      id:2,
      checked: false,
      label: 'Ter'
    },
    {
      id:3,
      checked: false,
      label:'Qua'
    },
    {
      id:4,
      checked: false,
      label:'Qui'
    },
    {
      id:5,
      checked: false,
      label:'Sex'
    },
    {
      id:6,
      checked: false,
      label:'Sáb'
    },
    {
      id:7,
      checked: false,
      label:'Dom'
    } ];
  selectedDays: number[] = [];
  listColors: any[] = [
    {
      label: "Primary",
      classColor: "primary",
      color: "#4361ee"
    },
    {
      label: "Info",
      classColor: "info",
      color: "#2196f3"
    },
    {
      label: "Success",
      classColor: "success",
      color: "#00ab55"
    },
    {
      label: "Warning",
      classColor: "warning",
      color: "#e2a03f"
    },
    {
      label: "Danger",
      classColor: "danger",
      color: "#e7515a"
    },
    {
      label: "Secondary",
      classColor: "secondary",
      color: "#805dca"
    },
    {
      label: "Dark",
      classColor: "dark",
      color: "#3b3f5c"
    },
    {
      label: "Black",
      classColor: "black",
      color: "#0e1726"
    },
  ]
  optionsChannel:any[] = [
    {
      id:"WHATSAPP",
      label: "whatsapp" 
    },
 
  ];
  optionsPeriod:any[] = [
    {
      sec:3600,
      label: "1 hora" 
    },
    {
      sec:21600,
      label: "6 horas" 
    },
    {
      sec:43200,
      label: "12 horas" 
    },
    {
      sec:86400,
      label: "24 horas" 
    }
  ];
  optionsModel:any[] = [];
  activeTab1 = 1;
  whatsappCheck:boolean = false;
  constructor() {
    this.preloadingTime = {
      noCalendar: true,
      enableTime: true,
      dateFormat: 'H:i',
      // position: this.store.rtlClass === 'rtl' ? 'auto right' : 'auto left',
      monthSelectorType: 'dropdown',
  };



  }
  onDaySelection(day: any, event: any) {
    if (event.target.checked) {
      // Adiciona o dia selecionado à lista de selecionados
      this.selectedDays.push(day.id);
    } else {
      // Remove o dia da lista de selecionados
      this.selectedDays = this.selectedDays.filter(d => d !== day.id);
    }
    console.log('Dias selecionados:', this.selectedDays);
  }
  
  toogleTab(arg: number) {
    if(this.params.value.id != null){
        this.activeTab1 = arg
    }else{
        this.activeTab1 = 1
        showMessage("Salve o recurso primeiro.",'warning')
    }


  }
 
  saveNotify(){
    let notifications = this.paramsNotification.getRawValue() as NotificationDTO;
    this.resource.notifications = [];
    this.resource.notifications.push(notifications);
 
    this._resourceService.update(this.resource)
    .subscribe(
      (resp:any)=>{
        this.alertMsgAndRedirectBack();
      }
    );

    ''
  }

  ngOnInit(): void {
    this._templateService.getAllSelection()
    .subscribe(
      (resp:any)=>{
        this.optionsModel = resp;
      }
    );

    this.paramsNotification = this._fb.group({
      channel:[null],
      antecedence:[null],
      model:[null]
    });

    this.params = this._fb.group({
      id:[null], 
      dairyName: ['', Validators.required],
      email:['', [ Validators.required,  Validators.email]],
      classColor:['',  Validators.required],
      timeAttendance:['',  Validators.required],
      active:[''],
      morning:[null],
      afternoon:[null],
      night:[null],
      dawn:[null],
      selectedDays: [[]],
      title: ['',  Validators.required],
      location: [null ],
      description: ['',  Validators.required],
    });
    this.paramsDates = this._fb.group({
      morningInit: [''],
      morningEnd: [''],
      afternoonInit: [''],
      afternoonEnd: [''],
      nightInit: [''],
      nightEnd: [''],
      dawnInit: [''],
      dawnEnd: [''],
      
    });


    this.route.paramMap.subscribe((params) => {
 
      if(params.get('id') != undefined){
        this.id = params.get('id')!;
        this._resourceService.obtem(this.id)
        .subscribe(
          (resp:any)=>{
            this.resource = resp;
            this.params.patchValue(resp); 
            if(resp.notifications.length > 0){
              this.paramsNotification.patchValue(resp.notifications[0]);
              this.whatsappCheck = true;
            }
            
            this.params.controls['classColor'].setValue(resp.color.color);
            this.selectedColor = resp.color;

            this.selectedResource = resp;
            if(this.selectedResource.morning != null){
              this.morningCheck = true;
              this.paramsDates.controls['morningInit'].setValue(this.selectedResource.morning.init);
              this.paramsDates.controls['morningEnd'].setValue(this.selectedResource.morning.end);
            }
            if(this.selectedResource.afternoon != null){
              this.afternoonCheck = true;
              this.paramsDates.controls['afternoonInit'].setValue(this.selectedResource.afternoon.init);
              this.paramsDates.controls['afternoonEnd'].setValue(this.selectedResource.afternoon.end);
            }
            if(this.selectedResource.night != null){
              this.nightCheck = true;
              this.paramsDates.controls['nightInit'].setValue(this.selectedResource.night.init);
              this.paramsDates.controls['nightEnd'].setValue(this.selectedResource.night.end);
            }
            if(this.selectedResource.dawn != null){
              this.dawnCheck = true;
              this.paramsDates.controls['dawnInit'].setValue(this.selectedResource.dawn.init);
              this.paramsDates.controls['dawnEnd'].setValue(this.selectedResource.dawn.end);
            }
            this.daysOfWeek
            .filter((item:any) => resp.selectedDays.includes(item.id))
            .forEach((item:any) => {
              item.checked = true;
              this.selectedDays.push(item.id);
            })
          }
        )
      }
    
    });
 
    

    
  }

  
  changeCheckMor(event:any, el:any){
    this.morningCheck = !this.morningCheck
  } 
 
  changeCheckAft(event:any, el:any){
    this.afternoonCheck = !this.afternoonCheck
  } 
 
  changeCheckWhatsapp(event:any, el:any){
    this.whatsappCheck = !this.whatsappCheck
  } 
 
  changeCheckNig(event:any, el:any){
    this.nightCheck = !this.nightCheck
  } 
 
  changeCheckDaw(event:any, el:any){
    this.dawnCheck = !this.dawnCheck
  } 

  selectedColor:any;
  
  selectColor(event:any){ 
    this.selectedColor = event;
  }
   
  isSubmitForm:boolean =  false;
  resource:any;
  submit(){
    this.isSubmitForm = true;
    if (this.params.valid) {
      this.mountDays();

      this.params.controls["selectedDays"].setValue(this.selectedDays);
      let formResource =  this.params.getRawValue();
 
      formResource.color = this.selectedColor; 
      
      let action = (this.id == null)?this._resourceService.save(formResource):this._resourceService.update(formResource)
      
      action
      .subscribe((resp:any) => {
        this.resource = resp;
        this.alertMsgAndRedirectBack();
      });
    }
 


  }

  private alertMsgAndRedirectBack() {
    let msgs = "Recurso salvo com sucesso.";
    this._messageService.sendMessage({ "msg": msgs, "tipo": 'success' } as Message);
    this.router.navigate(['/apps/agendai/recurso']);
  }

  private mountDays() {
    if (this.morningCheck == true) {
      this.params.controls['morning'].setValue({
        "init": this.paramsDates.controls["morningInit"].value,
        "end": this.paramsDates.controls["morningEnd"].value
      });
    }
    if (this.afternoonCheck == true) {
      this.params.controls['afternoon'].setValue({
        "init": this.paramsDates.controls["afternoonInit"].value,
        "end": this.paramsDates.controls["afternoonEnd"].value
      });
    }
    if (this.nightCheck == true) {
      this.params.controls['night'].setValue({
        "init": this.paramsDates.controls["nightInit"].value,
        "end": this.paramsDates.controls["nightEnd"].value
      });
    }
    if (this.dawnCheck == true) {
      this.params.controls['dawn'].setValue({
        "init": this.paramsDates.controls["dawnInit"].value,
        "end": this.paramsDates.controls["dawnEnd"].value
      });
    }
  }




}
