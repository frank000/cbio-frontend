import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaService } from 'src/app/service/media.service';
import { IconModule } from 'src/app/shared/icon/icon.module';

@Component({
  selector: 'app-view-text-media',
  standalone: true,
  imports: [IconModule, CommonModule],
  templateUrl: './view-text-media.component.html',
  styleUrl: './view-text-media.component.css'
})
export class ViewTextMediaComponent {


  sanitizer = inject(DomSanitizer);
  mediaService = inject(MediaService);
  
  @Input()
  imagePath!:string;

  @Input()
  tooltipText!:string;

  @Input()
  message!:any;

  @Input()
  selectedUser!:any;
  
  ngOnInit(): void { 
    
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
