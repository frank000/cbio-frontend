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
    });
  }


  isSubmitForm = false;
  submit(){
    this.isSubmitForm = true;
    if (this.params.valid) { 
      let data = this.params.getRawValue();
      console.log(data);
      this.companyService.updateConfig(data)
      .subscribe(()=>{
        showMessage("Salvo com sucesso."); 
      });
      
    }
  }  
}
