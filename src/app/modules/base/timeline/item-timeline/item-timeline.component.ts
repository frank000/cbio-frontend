import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-item-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-timeline.component.html',
  styleUrl: './item-timeline.component.css'
})
export class ItemTimelineComponent {

  @Input()
  message:any = '';
  

  @Input()
  createdAt:any = '';

  @Input()
  fromCompany!:boolean;
 
}
