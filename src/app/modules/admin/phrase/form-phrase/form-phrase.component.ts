import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { showMessage } from 'src/app/modules/base/showMessage';
import { BtnSalvaVoltaComponent } from 'src/app/modules/common/btn-salva-volta/btn-salva-volta.component';
import { PhraseService } from 'src/app/service/phrase.service';
import { CrudInterface } from 'src/app/shared/models/crud.interface';
import { SharedModule } from 'src/shared.module';

@Component({
  selector: 'app-form-phrase',
  standalone: true,
  imports: [BtnSalvaVoltaComponent, CommonModule, SharedModule],
  templateUrl: './form-phrase.component.html',
  styleUrl: './form-phrase.component.css'
})
export class FormPhraseComponent {
  _fb = inject(FormBuilder);
  route = inject(ActivatedRoute);  
  router = inject(Router);
  id?: string = undefined;
  _phraseService = inject(PhraseService);
  paramsForm!: FormGroup;
  resourceSaved!: CrudInterface

  constructor() { 
    this.getEditResource();
    this.initForm();
  }

  initForm(){

    this.paramsForm = this._fb.group({
      id: [undefined], 
      description: ['', Validators.required],
    });
  }

  getEditResource(){
    this.route.paramMap.subscribe((params) => {
 
      if(params.get('id') != undefined){
        this.id = params.get('id')!;
        this._phraseService.obtem(this.id)
        .subscribe(
          (resp:any)=>{
            this.paramsForm.patchValue(resp)
          }
        )
      }
    
    }); 
  }


  isSubmitForm = false;
  submit(){
    this.isSubmitForm = true;
 
    if (this.paramsForm.valid) {
        //form validated success
        const attendant = this.paramsForm.getRawValue();

        let action = (this.id)? this._phraseService.update(attendant) : this._phraseService.save(attendant)
        action
        .subscribe(
          (resp:any) =>{
            this.resourceSaved = resp 
            showMessage('Cadastro realizado com sucesso.');
            this.router.navigate(['/admin/phrase'])
          }
        )
        
    }
  } 

}
