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
    if (this.selectedMessage) {
      this.replyEmail.emit(this.selectedMessage);
    }
  }
  

  forwardMail() {
    if (this.selectedMessage) {
      this.forwardEmail.emit(this.selectedMessage);
    }
  }
  
  
}
