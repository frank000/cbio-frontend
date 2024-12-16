import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { showMessage } from 'src/app/modules/base/showMessage';
import { ItemTimelineComponent } from 'src/app/modules/base/timeline/item-timeline/item-timeline.component';
import { BtnSalvaVoltaComponent } from 'src/app/modules/common/btn-salva-volta/btn-salva-volta.component';
import { TicketService } from 'src/app/service/ticket.service';
import { SharedModule } from 'src/shared.module';

@Component({
  selector: 'app-form-ticket',
  standalone: true,
  imports: [BtnSalvaVoltaComponent, CommonModule, SharedModule, ItemTimelineComponent],
  templateUrl: './form-ticket.component.html',
  styleUrl: './form-ticket.component.css'
})
export class FormTicketComponent {

  paramsTicket!: FormGroup;
  isSubmitForm = false;
  _fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  _ticketService = inject(TicketService);
  ticketSaved:any;
  options: any[] = []; // Inicializar como array vazio
  message:any;
  id?: string = undefined;

  constructor(){
    this.initForm();

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
    });
  }

  initForm(){
    this.paramsTicket = this._fb.group({
      id: [undefined],
      title: ['', Validators.required],
      protocolNumber: [null],
      ticketMessage: [null],
      type: [null,  Validators.required],
      fromCompany: [true]
    });
  }


  submit(){
    this.isSubmitForm = true;
    console.log(
      this.message);
      if (this.paramsTicket.valid) {
        //form validated success
        let ticket = this.paramsTicket.getRawValue();

        let action = (this.id)? this._ticketService.update(ticket) : this._ticketService.save(ticket)
        action
        .subscribe(
          (resp:any) =>{
            this.ticketSaved = resp;
            let initMsg = (this.id)? "Alteração" : "Cadastro";
            showMessage(initMsg + ' realizado com sucesso.');
          }
        )
    }
  }
}
