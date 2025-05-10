import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { showMessage } from 'src/app/modules/base/showMessage';
import { ItemTimelineComponent } from 'src/app/modules/base/timeline/item-timeline/item-timeline.component';
import { BtnSalvaVoltaComponent } from 'src/app/modules/common/btn-salva-volta/btn-salva-volta.component';
import { AuthService } from 'src/app/service/auth.service';
import { TicketService } from 'src/app/service/ticket.service';
import { SharedModule } from 'src/shared.module';
import { text } from 'stream/consumers';
import Swal from 'sweetalert2';

const CLOSED_TICKET = "FECHADO";
const IN_PROGRESS = "EM_ATENDIMENTO";
@Component({
    selector: 'app-form-ticket',
    imports: [BtnSalvaVoltaComponent, CommonModule, SharedModule, ItemTimelineComponent],
    templateUrl: './form-ticket.component.html',
    styleUrl: './form-ticket.component.css'
})
export class FormTicketComponent {

  paramsTicket!: FormGroup;
  isSubmitForm = false;
  _fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  router = inject(Router);
  _ticketService = inject(TicketService);
  ticketSaved:any;
  options: any[] = []; // Inicializar como array vazio
  message:any;
  id?: string = undefined;
  optionsStatus: any[] = []; // Inicializar como array vazio
  swalWithBootstrapButtons:any;

  constructor(
    public storeData: Store<any>,
  ){
    this.initForm();
    this.initStore();

    this.swalWithBootstrapButtons = Swal.mixin({
      buttonsStyling: false,
      customClass: {
          popup: 'sweet-alerts',
          confirmButton: 'btn btn-secondary',
          cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
      },
    });

    this.route.paramMap.subscribe((params) => {
 
      if(params.get('id') != undefined){
        this.id = params.get('id')!;
        this._ticketService.obtem(this.id)
        .subscribe(
          (resp:any)=>{
            this.ticketSaved = resp;
            this.paramsTicket.patchValue(resp)
          }
        )
      }
      
      this._ticketService.obtemTiposTicket()
      .subscribe(
        (resp:any)=>{
          this.options = resp;
        }
      );
      
      this._ticketService.obtemTiposStatus()
      .subscribe(
        (resp:any)=>{
          this.optionsStatus = resp;
        }
      );

    });
  }

  store: any;
  async initStore() {
    this.storeData
        .select((d) => d.index)
        .subscribe((d) => {
            this.store = d;
        });
}

  initForm(){
    this.paramsTicket = this._fb.group({
      id: [undefined],
      title: ['', Validators.required],
      protocolNumber: [null],
      ticketMessage: [null,Validators.required],
      type: [null,  Validators.required],
      status: ["NOVO",  Validators.required],
      fromCompany: [true]
    });
  }


  submit(){
    this.isSubmitForm = true;
 
      if (this.paramsTicket.valid) {

        if(this.id != null && this.ticketSaved.status == CLOSED_TICKET){
          this.swalWithBootstrapButtons
          .fire({
              title: 'Ticket fechado',
              text: 'O ticket está fechado, ao alterar ele vai reabrir. Deseja continuar?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Sim',
              cancelButtonText: 'Não',
              reverseButtons: true,
              padding: '2em',
          })
          .then((result:any) => {
              if (result.value) {
                let ticket = this.paramsTicket.getRawValue();
                ticket.status = IN_PROGRESS;
                this.processSubmit(ticket);
              }  
          }); 
        }else{
          let ticket = this.paramsTicket.getRawValue();
          this.processSubmit(ticket);

        } 
    }
  }


  private processSubmit(ticket:any) {
    
    ticket.fromCompany = !this.authService.hasRole(this.authService.SUPERADMIN_ROLE);


    let action = (this.id) ? this._ticketService.update(ticket) : this._ticketService.save(ticket);
    action
      .subscribe(
        (resp: any) => {
          this.ticketSaved = resp;
          let initMsg = (this.id) ? "Alteração" : "Cadastro";
          this.router.navigate(['dashboard/tickets']);
          showMessage(initMsg + ' realizado com sucesso.');
        }
      );
  }

  getListTickets() {
    // Ordena as mensagens com base na data de criação, de forma decrescente (do mais recente para o mais antigo)
    return this.ticketSaved.ticketMessages
    .sort((a:any, b:any) => {
      const dateA:any = new Date(a.createdAt.split(' ')[0].split('/').reverse().join('-') + 'T' + a.createdAt.split(' ')[1]);
      const dateB:any = new Date(b.createdAt.split(' ')[0].split('/').reverse().join('-') + 'T' + b.createdAt.split(' ')[1]);
      return dateB - dateA;  // Retorna negativo para b vir primeiro, ou positivo para a vir primeiro
    });
  }
}
