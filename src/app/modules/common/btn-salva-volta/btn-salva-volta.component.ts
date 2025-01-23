import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedModule } from 'src/shared.module';

@Component({
    selector: 'app-btn-salva-volta',
    imports: [CommonModule, SharedModule, RouterLink],
    templateUrl: './btn-salva-volta.component.html',
    styleUrl: './btn-salva-volta.component.css'
})
export class BtnSalvaVoltaComponent {

  @Input()
  location:string = ""  
  
  @Input()
  edit:boolean = false 

  @Input()
  isDisabled:any = false

  
}
