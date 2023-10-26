import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mail } from 'src/app/model/mail';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { MessageActionsComponent } from '../message-actions/message-actions.component';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-message-viewer',
  standalone: true,
  imports: [CommonModule, MaterialModule, MessageActionsComponent],
  templateUrl: './message-viewer.component.html',
  styleUrls: ['./message-viewer.component.scss'],
})
export class MessageViewerComponent {
  @Input() selectedMessage: Mail | null = null;
  @Input() isComposeMode: boolean = false;
  @Input() favoriteMessages: Mail[] = [];
  @Output() favoriteEmail: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Output() removeFavoriteEmail: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Output() removeImportantEmail: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Output() importantEmail: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Output() replyEmail: EventEmitter<void> = new EventEmitter<void>();
  @Output() forwardEmail: EventEmitter<Mail> = new EventEmitter<Mail>();

  constructor(private router: Router, private storage: StorageService) {}

  addTofavorite() {
    if (this.selectedMessage) {
      const copyOfSelectedMessage: Mail = { ...this.selectedMessage };
      this.favoriteEmail.emit(copyOfSelectedMessage);
      this.selectedMessage.isFavourite = true;
    }
  }

  removeFromfavorite() {
    if (this.selectedMessage) {
      const copyOfSelectedMessage: Mail = { ...this.selectedMessage };
      this.removeFavoriteEmail.emit(copyOfSelectedMessage);
      this.selectedMessage.isFavourite = false;
      console.log('viewer favorite remove');
    }
  }

  unMarkAsImportant() {
    if (this.selectedMessage) {
      const copyOfSelectedMessage: Mail = { ...this.selectedMessage };
      this.removeImportantEmail.emit(copyOfSelectedMessage);
      this.selectedMessage.important = false;
      console.log('viewer important remove');
    }
  }
  markAsImportant() {
    if (this.selectedMessage) {
      const copyOfSelectedMessage: Mail = { ...this.selectedMessage };
      this.importantEmail.emit(copyOfSelectedMessage);
      this.selectedMessage.important = true;
    }
  }

  replyToEmail() {
    this.replyEmail.emit();
    if (this.selectedMessage) {
      this.router.navigate(['/editor'], {
        queryParams: {
          to: this.selectedMessage.from,
          from: this.selectedMessage.to,
          subject: 'RE '+ this.selectedMessage.subject
        }, state: { initialMessage: this.selectedMessage }
      });
    }
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
      });}
    }
  }
  
  
}
