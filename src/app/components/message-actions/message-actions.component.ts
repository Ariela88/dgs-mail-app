import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module/material/material.module';

@Component({
  selector: 'app-message-actions',
  standalone: true,
  imports: [CommonModule,MaterialModule],
  templateUrl: './message-actions.component.html',
  styleUrls: ['./message-actions.component.scss']
})
export class MessageActionsComponent {
  @Output() replyMail: EventEmitter<void> = new EventEmitter<void>(); 
  @Output() inolterAMail: EventEmitter<void> = new EventEmitter<void>(); 

  reply() {
  this.replyMail.emit(); 
  }

  inolter(){
   
    this.inolterAMail.emit()
  }


}
