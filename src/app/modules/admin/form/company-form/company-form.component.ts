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
import { CanalService } from 'src/app/service/canal.service';
import { Canal } from 'src/app/shared/models/canal.interface';
import { HttpParams } from '@angular/common/http';
import { colDef } from '@bhplugin/ng-datatable';
import { TierService } from 'src/app/service/tier.service';

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
  swalWithBootstrapButtons:any;
  options = ['TELEGRAM', '  WHATSAPP', 'INSTAGRAM', 'FACEBOOK'];
  input1 = 'TELEGRAM';

  _enderecoService = inject(EnderecoService);  
  _companyService = inject(CompanyService);  
  _userService = inject(UserService);
  _canalService= inject(CanalService);
  _tierService= inject(TierService);
  
  _fb = inject(FormBuilder);

  ufs: SelectionDTO[] = [];
  uf!: string;
  paramsUser!: FormGroup;
  paramsCompany!: FormGroup;  
  paramsConfig!: FormGroup;
  companySaved:Company = {} as Company;
  gridRowsCanal: Canal[] = []
  cols: Array<colDef> = [];

  cidades: SelectionDTO[] = [];
  cidade!: string;
  route = inject(ActivatedRoute);
  id?: string = undefined;

  tiers:any[] = [];
  tier:any;

  constructor() {
    
    this.initData();
    this.initForm();

  
 
    this.carregaValoresParaUpdate();  

      
    this.swalWithBootstrapButtons = Swal.mixin({
      buttonsStyling: false,
      customClass: {
          popup: 'sweet-alerts',
          confirmButton: 'btn btn-secondary',
          cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
      },
    });
  }

  private carregaValoresParaUpdate() {
    this.route.paramMap.subscribe((params) => {

      if (params.get('companyid') != undefined) {
        this.id = params.get('companyid')!;

        this._companyService.obtemCompany(this.id)
          .subscribe(
            (resp: any) => {
              this.companySaved = resp;
              this.paramsCompany.patchValue(this.companySaved);
              this.paramsUser;
              this.carregaGridCanal();


            }
          );

        this._userService.obtemAdminUserByCompany(this.id)
          .subscribe(
            (result: any) => {
              this.paramsUser.patchValue(result);
            }
          );
      }

    });
  }

   carregaGridCanal() {
    let query = new HttpParams();
    query = query.append('idCompany', this.companySaved.id);
    this._canalService.obtemGrid(query)
      .subscribe(
        (resp: any) => {
          this.gridRowsCanal = resp.items;
        }
      );
  }
  initForm(){
    this.paramsUser = this._fb.group({
        id: [undefined],
        email: ['', Validators.compose([Validators.required, Validators.email])],
        password: ['', Validators.required], 
    });
    this.paramsCompany = this._fb.group({
        id: [undefined],
        email: ['', Validators.compose([Validators.required, Validators.email])],
        nome: ['', Validators.required], 
        telefone: ['', Validators.required], 
        endereco: ['', Validators.required], 
        estado: ['', Validators.required], 
        cidade: ['', Validators.required], 
        tier: ['', Validators.required], 
        cep: [''], 
        porta:['', Validators.required], 
    });    
    this.paramsConfig = this._fb.group({
        id: [undefined],
        cliente: ['', Validators.required], 
        nome: ['', Validators.required], 
        idCanal: ['', Validators.required], 
        ativo: [true, Validators.required], 
        token: ['', Validators.required], 
        primeiroNome: ['' ], 
        apiKey: ['',  Validators.required], 
    });
  }

  initData(){ 

    this.cols = [
      { field: "id", title: "ID", filter: false, sort: false },
      { field: "nome", title: "Nome" },
      { field: "idCanal", title: "Identificador" },
      { field: "acoes", title: "Ações" }

  ];

    this._enderecoService.getUfs()
    .subscribe(
      (resp:any) =>{ 
        this.ufs = resp;

      }
    );

    this._tierService.getAll()
    .subscribe(
      (resp:any)=>{
        this.tiers = resp;
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

  loadToEdit(value:any){
    this.paramsConfig.patchValue(value);
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
            this.paramsUser.controls["email"].setValue(this.companySaved.email);
            this.showMessage('Cadastro realizado com sucesso.');
          }
        )
        
    }
  } 
  
  isSubmitFormUser = false;
  submitUser(){
 
    this.swalWithBootstrapButtons
    .fire({
        title: 'Tem certeza que deseja alterar a senha ?',
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
          this.runSubmitUserAdmin();
        }  
    });


    
  }  

  isSubmitFormConfig = false;
  private runSubmitUserAdmin() {
    this.isSubmitFormUser = true;
    if (this.paramsUser.valid) {
      let user = this.paramsUser.getRawValue() as User;
      user.company = this.companySaved;

      let action = (this.companySaved.id && user.id) ? this._userService.update(user) : this._userService.save(user);


      action
        .subscribe(
          (resp: any) => {

            this.showMessage('Cadastro realizado com sucesso.');
          }
        );
    }
  }

  submitConfig(){
      
    this.isSubmitFormConfig = true;
    if (this.paramsConfig.valid) {

      let configuration = this.paramsConfig.getRawValue();
      configuration.company = this.companySaved;
     
      let action = (this.companySaved.id && this.paramsConfig.controls['id'].value)?  this._canalService.update(configuration):  this._canalService.save(configuration);

      action
      .subscribe(
        (resp:any) =>{
          this.carregaGridCanal();
          this.paramsConfig.reset()
          this.showMessage('Cadastro realizado com sucesso.');
        }
      )
    }
  }

  deleteCanal(canal:any){
    this._canalService.delete(canal.id).subscribe(
      (resp:any) =>{
        this.gridRowsCanal = this.gridRowsCanal.filter(row => row.id != canal.id);
      }
    )
  }

  connect(canalId:any){
    this._canalService.conect(canalId).subscribe(
      (resp:any) =>{
        this.showMessage("Conectado com sucesso.");
      }
    )
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


getFreePort(){
  this._companyService.getFreePort()
  .subscribe(
    (resp:any) =>{
      this.paramsCompany.controls["porta"].setValue(resp);
    }
  )
} 
}
