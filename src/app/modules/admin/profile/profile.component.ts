import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { toggleAnimation } from 'src/app/shared/animations'; 
import { SharedModule } from 'src/shared.module';
import { AvatarUtil } from '../../base/avatar-util';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { UserService } from 'src/app/service/user.service';
import { showMessage } from '../../base/showMessage';

@Component({
    selector: 'app-profile',
    imports: [CommonModule, SharedModule],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
    animations: [toggleAnimation]
})
export class ProfileComponent implements OnInit{

  userLocal:any;
  authService = inject(AuthService);
  _userService = inject(UserService);
  _fb = inject(FormBuilder);
  userLocalPerfil:string = "visitante";
  paramsUser!:FormGroup;
  @ViewChild('updateUserPassModal') updateUserPassModal!: NgxCustomModalComponent;

  confirmPasswordValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => { 
    
    return control.value.password1 === control.value.password2
      ? null
      : { PasswordNoMatch: true };
  };

  constructor(){

    
  }
  ngOnInit(): void {
    this.userLocal = this.authService.getObjectUserLogged(); 
    this.userLocalPerfil = this.authService.getRole(this.userLocal);
    this.initForm();
  }

  initForm(){
    this.paramsUser =  new FormGroup({
      password1: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
      password2: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
  }, {validators: this.confirmPasswordValidator} );
  }

  get password1(){
    return this.paramsUser.get('password1');

  }

  get password2(){
    return this.paramsUser.get('password2');

  }

  getInitialCharacters(){
    if(this.userLocal.name){
        return AvatarUtil.getInitialCharacters(this.userLocal.name);
    }else{
        return "USER";
    }
  } 
  submitModal(){

    let user = {
      id: this.userLocal.userId,
      password : this.password1?.value
    };
    this._userService.updatePassword(user)
    .subscribe(
      (result:any)=>{
        showMessage("Senha alterada com sucesso!");
        this.updateUserPassModal.close();
      }
    );
  }

  openModalUpdatePassword(modal:any){
    this.paramsUser.reset();
    this.updateUserPassModal.open();
  }

}
