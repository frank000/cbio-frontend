import { Component, inject } from '@angular/core';
import { BtnSalvaVoltaComponent } from "../../../common/btn-salva-volta/btn-salva-volta.component";
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectionDTO } from 'src/app/shared/models/selectionDTO';
import { User } from 'src/app/shared/models/user.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendantService } from 'src/app/service/attendant.service';
import { showMessage } from 'src/app/modules/base/showMessage';
import Swal from 'sweetalert2';
import { MessageService } from 'src/app/service/message.service';
import { Message } from 'src/app/shared/models/message';

@Component({
  selector: 'app-form-attendant',
  standalone: true,
  imports: [BtnSalvaVoltaComponent, CommonModule, SharedModule],
  templateUrl: './form-attendant.component.html',
  styleUrl: './form-attendant.component.css'
})
export class FormAttendantComponent {

  paramsAttendant!: FormGroup;
  perfis: SelectionDTO[] = [] 
  _fb = inject(FormBuilder);
  route = inject(ActivatedRoute);  
  router = inject(Router);
  _msgService = inject(MessageService);
  _AttendantService = inject(AttendantService);
  id?: string = undefined;
  swalWithBootstrapButtons:any;
  attendantSaved!: User

  constructor() { 
    
    this.initForm();


    this.route.paramMap.subscribe((params) => {
 
      if(params.get('id') != undefined){
        this.id = params.get('id')!;
        this._AttendantService.obtem(this.id)
        .subscribe(
          (resp:any)=>{
            this.attendantSaved = resp;
            this.paramsAttendant.patchValue(resp)
          }
        )
      }
    
    });

    this.swalWithBootstrapButtons = Swal.mixin({
      buttonsStyling: false,
      customClass: {
          popup: 'sweet-alerts',
          confirmButton: 'btn btn-secondary',
          cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
      },
    });
  }

  initForm(){
    this.paramsAttendant = this._fb.group({
      id: [undefined],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      name: ['', Validators.required],
      password: [''],
    });
  }

  isSubmitForm = false;
  submit(){

 

    this.isSubmitForm = true;
    const isUpdate = this.id != undefined;
    const userSettedPassInScreen = this.paramsAttendant.controls['password'].value != "";
 

    if (!isUpdate && !userSettedPassInScreen) {

        showMessage('Senha é obrigatório.', 'error');
        return;

    }else if(isUpdate && userSettedPassInScreen){

      this.swalWithBootstrapButtons
      .fire({
          title: 'Tem certeza que deseja alterar a senha?',
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
            this.runSubmit();
          }  
      });
    }else{
      this.runSubmit();
    }

  


    
  } 
  
  


  private runSubmit() {
    if (this.paramsAttendant.valid) {
      //form validated success
      const attendant = this.paramsAttendant.getRawValue() as User;

      let action = (this.id) ? this._AttendantService.update(attendant) : this._AttendantService.save(attendant);
      let typeAction = (this.id)? "Cadastro": "Alteração"  
      action
        .subscribe(
          (resp: any) => {
            this.attendantSaved = resp;
            this.paramsAttendant.controls["email"].setValue(this.attendantSaved.email);
            let msgs = `${typeAction} realizado com sucesso.`;

            this._msgService.sendMessage({"msg":msgs, "tipo": 'success'} as Message); 
            this.router.navigate(['/admin/attendant']);

          }
        );

    }
  }
}
