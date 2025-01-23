import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AvatarUtil } from '../avatar-util';

@Component({
    selector: 'app-avatar',
    imports: [CommonModule],
    templateUrl: './avatar.component.html',
    styleUrl: './avatar.component.css'
})
export class AvatarComponent {

  @Input()
  showImage:boolean = false;

  @Input()
  name:string = "User";


  getInitialCharacters(nameParam:any = null){
    if(nameParam != null){
      return AvatarUtil.getInitialCharacters(nameParam);
    }else{
      return "USER";
    }
}


}
