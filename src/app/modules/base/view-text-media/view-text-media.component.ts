import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IaService } from 'src/app/service/ia.service';
import { MediaService } from 'src/app/service/media.service';
import { IconModule } from 'src/app/shared/icon/icon.module';

@Component({
    selector: 'app-view-text-media',
    imports: [IconModule, CommonModule],
    templateUrl: './view-text-media.component.html',
    styleUrl: './view-text-media.component.css'
})
export class ViewTextMediaComponent {


  sanitizer = inject(DomSanitizer);
  mediaService = inject(MediaService);
  iaService = inject(IaService);
  
  @Input()
  imagePath!:string;

  @Input()
  tooltipText!:string;

  @Input()
  message!:any;

  @Input()
  selectedUser!:any;
  

  @Input()
  listMessages!:any;  
  

  @Input()
  modalIaTip!:any;
  
  ngOnInit(): void { 
    
  }

ia(messageId:any, text:any, ){
  if(this.selectedUser.active){
    let list = this.listMessages;

    const targetIndex = list.findIndex((item:any) => item.id === messageId);
    let tamanho = list.length;
    if(list.length > 16){
      tamanho = 16;
    }
    // Verifica se o índice existe e se há pelo menos 4 elementos anteriores
    const previousItems = targetIndex > tamanho - 1 ? list.slice(targetIndex - tamanho, targetIndex) : list.slice(0, targetIndex);
    let conversation = "";
    
    previousItems.map(
      (item:any)=>{
        conversation += "{" + item.text +"}"
      }
    );
    conversation += "{" + text +"}" 
    this.iaService.obtem(conversation)
    .subscribe((item:any)=>{ 
      this.iaService.iaTipSubscription.next(item);
      this.modalIaTip.open();
    });
  }
   
    
  }
  replaceAsterisksWithStrongTags(text:string) {
    const formattedText = text.replace(/\*(.*?)\*/g, '<strong>$1</strong><br/>');
    return this.sanitizer.bypassSecurityTrustHtml(formattedText);
  }

  downloadMedia(dialogId:string){
    
      this.mediaService.download(dialogId)
      .subscribe();
  }

}
