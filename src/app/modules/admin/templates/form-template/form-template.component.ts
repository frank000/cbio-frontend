import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmojiPickerComponent } from 'src/app/modules/apps/chat/emoji-picker/emoji-picker.component';
import { BtnSalvaVoltaComponent } from 'src/app/modules/common/btn-salva-volta/btn-salva-volta.component';
import { MessageService } from 'src/app/service/message.service';
import { TemplateService } from 'src/app/service/template.service';
import { BodyDTO } from 'src/app/shared/models/bodyDTO';
import { Message } from 'src/app/shared/models/message';
import { ModelDTO } from 'src/app/shared/models/modelDTO';
import { SharedModule } from 'src/shared.module';

@Component({
  selector: 'app-form-template',
  standalone: true,
  imports: [CommonModule, SharedModule , RouterLink, BtnSalvaVoltaComponent, EmojiPickerComponent],
  templateUrl: './form-template.component.html',
  styleUrl: './form-template.component.css'
})
export class FormTemplateComponent {
  matches:any[] | null = [];
  model:ModelDTO = {
    name:null,
    body:{} as BodyDTO} as ModelDTO;
  matchesCleaned!:any[] | null;
  id!:string;
  _templateService: TemplateService = inject(TemplateService);
  _messageService: MessageService = inject(MessageService);
  route = inject(ActivatedRoute);  
  router: Router = inject(Router);
  optionsTypeParameter:any[] = [
    {
      id:'estatico',
      label:"Estático"
    },
    {
      id:'dinamico',
      label:"Dinâmico"
    }
  ];
  optionsDynamics:any[] = [
    {
      id:'nome',
      label:"Nome"
    },
    {
      id:'email',
      label:"E-mail"
    },
    
    {
      id:'cpf',
      label:"CPF"
    },
    
    {
      id:'dataHoraAtendimentoAberto',
      label:"Data/hora de inicio atendimento"
    },
    
    {
      id:'atendenteNome',
      label:"Nome atendente"
    },
    
    {
      id:'title',
      label:"Título do evento"
    },
    {
      id:'description',
      label:"Descricao do evento"
    },
    {
      id:'dairyName',
      label:"Nome do recurso"
    },
    {
      id:'start',
      label:"Início do evento"
    },
    {
      id:'end',
      label:"Fim do evento"
    },
    {
      id:'company.name',
      label:"Nome da copanhia"
    },
  ];

  constructor(){
    this.route.paramMap.subscribe((params) => {
 
      if(params.get('id') != undefined){
        this.id = params.get('id')!;
        this._templateService.obtem(this.id)
        .subscribe(
          (resp:any)=>{
            this.model = resp;
          }
        )
      }
    
    }); 
  }
  typies: any[] = []


  changeTextarea(event:any){
       
    const input = (event.target as HTMLTextAreaElement).value;
    this.matches = input.match(/{{\d+}}/g); // Expressão para detectar {{1}}, {{2}}, etc.
    if(this.matches != null){
      this.matchesCleaned = this.matches.map(
        (item:string)=>{
          return item.replace("{{", "").replace("}}", "");
        }
      );

    }
  }
  
  verificarValorName() {
    console.log("Valor atual de name:", this.model.name);
}
  changeTypeParameter(event:any, i:any){
      // Busca o parâmetro com o ID fornecido, retornando o primeiro encontrado (se existir)
      let param = this.parameters.find((item: any) => item.id === i);

      const ids = this.optionsTypeParameter.map(option => option.id);
      let labelType = ""; 
      if(ids.includes(event.id)){
        labelType = "TEXT"; 
      }

      if (param) {
          // Se já existe, atualiza apenas o valor do tipo
          param.type = labelType;
      } else {
          // Se não existe, cria um novo objeto com o ID e tipo, e adiciona ao array
          this.parameters.push({
              id: i,
              type: labelType
          });
      }console.log(param);
      
  }

  parameters: any[] = [] 
  onSavedModel(){ 

    if(this.parameters.length > 0 && this.hasChangeInParameter){
      this.model.body!.parameters = this.parameters;
    }

    let action = (this.id == null)?this._templateService.save(this.model): this._templateService.update(this.model);

    action
    .subscribe(
      (resp:any)=>{
        console.log(resp);
        let msgs = "Modelo salvo com sucesso."
        this._messageService.sendMessage({"msg":msgs, "tipo": 'success'} as Message); 
        this.router.navigate(['/admin/template']);
      }
    );
    
  }

  hasChangeInParameter = false;
  changeDynamicParameter(event:any, i:any){
   // Busca o parâmetro com o ID fornecido, retornando o primeiro encontrado (se existir)
   let param = this.parameters.find((item: any) => item.id === i);
   param.type = 'TEXT'
   if (param) {
       // Se já existe, atualiza apenas o valor do tipo
       param.value = "#{" + event.id + "}";
   } else {
       // Se não existe, cria um novo objeto com o ID e tipo, e adiciona ao array
       this.parameters.push({
           id: i,
           value: event.id
       });
   }
   this.hasChangeInParameter = true;
  }


  changeParameter(event: any, i: any) {
    // Busca o parâmetro com o ID fornecido, retornando o primeiro encontrado (se existir)
    let param = this.parameters.find((item: any) => item.id === i);
   param.type = 'TEXT'
    if (param) {
        // Se já existe, atualiza apenas o valor do tipo
        param.value = event.target.value;
    } else {
        // Se não existe, cria um novo objeto com o ID e tipo, e adiciona ao array
        this.parameters.push({
            id: i,
            value: event.target.value
        });
    }
    this.hasChangeInParameter = true;
  }

  showEmojiPicker = false;

toggleEmojiPicker() {
  this.showEmojiPicker = !this.showEmojiPicker;
}

addEmoji(emoji: string) {
  if( this.model!.body!.label == undefined){
    this.model!.body!.label  = ""
  }
  this.model!.body!.label += emoji;
  this.showEmojiPicker = false;
}
}
