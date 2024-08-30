import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { subscribe } from 'diagnostics_channel';
import { CompanyService } from 'src/app/service/company.service';
import { EnderecoService } from 'src/app/service/endereco.service';
import { Company } from 'src/app/shared/models/company.interface';
import { SelectionDTO } from 'src/app/shared/models/selectionDTO';
import { SharedModule } from 'src/shared.module';
import Swal from 'sweetalert2';
import { BtnSalvaVoltaComponent } from "../../../common/btn-salva-volta/btn-salva-volta.component";
import { User } from 'src/app/shared/models/user.interface';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterLink, BtnSalvaVoltaComponent, CompanyFormComponent],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.css'
})
export class CompanyFormComponent {
  toogleTab(arg: number) {
    if(this.companySaved.id != undefined){
      this.activeTab1 = arg
    }else{
      this.activeTab1 = 1
      this.showMessage("Não tem uma companhia salva.",'warning')
    } 
  
  }
  activeTab1 = 1;
 
  options = ['TELEGRAM', '  WHATASAPP', 'INSTAGRAM', 'FACEBOOK'];
  input1 = 'TELEGRAM';

  _enderecoService = inject(EnderecoService);  
  _companyService = inject(CompanyService);  
  _userService = inject(UserService);
  
  _fb = inject(FormBuilder);

  ufs: SelectionDTO[] = [];
  uf!: string;
  paramsUser!: FormGroup;
  paramsCompany!: FormGroup;
  companySaved:Company = {} as Company;


  cidades: SelectionDTO[] = [];
  cidade!: string;
  route = inject(ActivatedRoute);
  id!: string;
  constructor() { 
    
    this.initData();
    this.initForm();

    this.route.paramMap.subscribe((params) => {
 
      this.id = params.get('companyid')!;
      this._companyService.obtemCompany(this.id)
      .subscribe(
        (resp:any)=>{
          this.companySaved = resp
          this.paramsCompany.patchValue(this.companySaved)
        }
      )
    });  
  }

  initForm(){
    this.paramsUser = this._fb.group({
        id: [0],
        email: ['', Validators.compose([Validators.required, Validators.email])],
        password: ['', Validators.required], 
    });    
    this.paramsCompany = this._fb.group({
        id: [0],
        email: ['', Validators.compose([Validators.required, Validators.email])],
        nome: ['', Validators.required], 
        telefone: ['', Validators.required], 
        endereco: ['', Validators.required], 
        estado: ['', Validators.required], 
        cidade: ['', Validators.required], 
        cep: [''], 
    });
  }

  initData(){ 
    
    this._enderecoService.getUfs()
    .subscribe(
      (resp:any) =>{ 
        this.ufs = resp;

      }
    );
    
  }

  changeUf(event:any){
    this._enderecoService.getCidades(this.uf)
    .subscribe(
      (resp:any) =>{ 
        
        this.cidades = resp;

      }
    )
  }

  isSubmitForm = false;
  submit(){
    this.isSubmitForm = true;
    if (this.paramsCompany.valid) {
        //form validated success
        const company = this.paramsCompany.getRawValue() as Company;

        let action = (this.companySaved.id)? this._companyService.update(company) : this._companyService.save(company)
        action
        .subscribe(
          (resp:any) =>{
            this.companySaved = resp
            this.showMessage('Cadastro realizado com sucesso.');
          }
        )
        
    }
  } 
  
  isSubmitFormUser = false;
  submitUser(){
    this.isSubmitFormUser = true;
    if (this.paramsUser.valid) {
      let user = this.paramsUser.getRawValue() as User;
      user.company = this.companySaved;

      this._userService.save(user)
      .subscribe(
        (resp:any) =>{

          this.showMessage('Cadastro realizado com sucesso.');
        }
      )
    }
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
}
