import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/shared.module';

@Component({
  selector: 'app-phrase-modal',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './phrase-modal.component.html',
  styleUrl: './phrase-modal.component.css'
})
export class PhraseModalComponent {

}
