import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mail } from 'src/app/model/mail';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { MessageActionsComponent } from '../message-actions/message-actions.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-message-viewer',
  standalone: true,
  imports: [CommonModule, MaterialModule, MessageActionsComponent],
  templateUrl: './message-viewer.component.html',
  styleUrls: ['./message-viewer.component.scss'],
})
export class MessageViewerComponent {

  @Input() isComposeMode: boolean = false;
  @Input() selectedMessage: Mail | null = null;
  @Output() replyEmail: EventEmitter<Mail> = new EventEmitter<Mail>();

  @Output() forwardEmail: EventEmitter<Mail> = new EventEmitter<Mail>();

  constructor(private router: Router) {}

  

  replyToEmail() {
    this.isComposeMode = true
    if (this.selectedMessage) {
      this.replyEmail.emit(this.selectedMessage);
    }
    
    // const queryParams = {
    //   to: this.selectedMessage?.from,
    //   from: this.selectedMessage?.to,
    //   subject: 'RE ' + this.selectedMessage?.subject,
    // }; 
   
   
     
  }
  

  forwardMail() {
    if (!this.isComposeMode) { 
      this.forwardEmail.emit();
      if (this.selectedMessage) {
        this.router.navigate(['/editor'], {
          queryParams: {
            from: this.selectedMessage?.to || '',  
            to: '', 
            subject: 'inoltro ' + (this.selectedMessage?.subject || ''), 
            body: 'inoltro ' + (this.selectedMessage?.subject || '') + ' ' + (this.selectedMessage?.from || ''), 
          },
          state: { initialMessage: this.selectedMessage }
        });
      }
    }
  }
  
  
}
