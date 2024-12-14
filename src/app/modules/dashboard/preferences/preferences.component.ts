import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/shared.module';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { CompanyService } from 'src/app/service/company.service';
import { showMessage } from '../../base/showMessage';
import { TemplateService } from 'src/app/service/template.service';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css'
})
export class PreferencesComponent implements OnInit{
  router = inject(Router);
  _fb = inject(FormBuilder);
  authService = inject(AuthService);

  _templateService = inject(TemplateService);
  companyService = inject(CompanyService);
  params!: FormGroup;
  constructor(){}
  keepSameAttendant = false;
  autoSend = false;
  optionsModel:any[] = [];

  ngOnInit(): void { 
    
    this.initForm();
    
    this._templateService.getAllSelection()
    .subscribe(
      (resp:any)=>{
        this.optionsModel = resp;
      }
    );

    this.companyService.getPreferences()
    .subscribe((resp:any)=>{
      this.params.patchValue(resp);
    });

    if(this.authService.getObjectUserLogged().companyId){
      this.params.controls['companyId'].setValue(this.authService.getObjectUserLogged().companyId);
    }
  }

  initForm(){
    this.params = this._fb.group({
      id:[null], 
      companyId:[null], 
      model:[null], 
      keepSameAttendant: [false, Validators.required],
      autoSend: [false, Validators.required],
      rag:[null], 
    });
  }


  isSubmitForm = false;
  submit(){
    console.log(this.params.value.model);
    
    this.isSubmitForm = true;
    if (this.params.valid && (this.params.value.autoSend == false || this.params.value.autoSend == true && this.params.value.model != null )) { 
      let data = this.params.getRawValue();
      console.log(data);
      
      const isArrayRag = data.rag instanceof Array;
      if(!isArrayRag){
        data.rag = [this.params.value.rag];
      }

      this.companyService.updateConfig(data)
      .subscribe(()=>{
        showMessage("Salvo com sucesso."); 
      });
      
    }else if(this.params.value.autoSend == true && this.params.value.model == null ){
      showMessage("Informe qual modelo do cartão de visitas.", 'warning');
    }
  }  
}
