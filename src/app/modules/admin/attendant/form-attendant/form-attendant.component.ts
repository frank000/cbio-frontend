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
  _AttendantService = inject(AttendantService);
  id?: string = undefined;

  attendantSaved!: User
  constructor() { 
    
    this.initForm();


    this.route.paramMap.subscribe((params) => {
 
      if(params.get('id') != undefined){
        this.id = params.get('id')!;
        this._AttendantService.obtem(this.id)
        .subscribe(
          (resp:any)=>{
            this.paramsAttendant.patchValue(resp)
          }
        )
      }
    
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
    if (this.id == undefined && this.paramsAttendant.controls['password'].value == "") {
        showMessage('Senha é obrigatório.', 'error');
        return;
    } 
    if (this.paramsAttendant.valid) {
        //form validated success
        const attendant = this.paramsAttendant.getRawValue() as User;

        let action = (this.id)? this._AttendantService.update(attendant) : this._AttendantService.save(attendant)
        action
        .subscribe(
          (resp:any) =>{
            this.attendantSaved = resp
            this.paramsAttendant.controls["email"].setValue(this.attendantSaved.email);
            showMessage('Cadastro realizado com sucesso.');
            this.router.navigate(['/admin/attendant'])
          }
        )
        
    }
  } 
  
  
}
