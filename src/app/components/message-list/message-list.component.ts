import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mail } from 'src/app/model/mail';
import { MessageViewerComponent } from '../message-viewer/message-viewer.component';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, MessageViewerComponent, MaterialModule, FormsModule],
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit{

  constructor(private cdr: ChangeDetectorRef) { this.cdr.markForCheck();}

  ngOnInit(): void {
    console.log('message list')
    
  }

  @Input() selectedMessage: Mail | null = null;
  @Output() messageSelectedOut = new EventEmitter<Mail>();
  @Output() messageDelete = new EventEmitter<Mail>();
  @Input() favoriteMessages: Mail[] = [];
  @Output() favoriteEmail: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Output() removeFavoriteEmail: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Output() removeImportantEmail: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Output() removeMail: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Output() importantEmail: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Input() messageSelected: Mail[] = [];
  @Output() messageListUpdate = new EventEmitter<Mail[]>();
  @Input() set updateMessages(messages: Mail[]) {
    if (messages && messages.length > 0) {
      this.messageSelected = messages;
    }
  }

  selectAllChecked: boolean = false;

  viewMessage(mail: Mail) {
    this.messageSelectedOut.emit(mail);
  }

  updateMessageList(messages: Mail[]) {
    this.messageListUpdate.emit(messages);
  }

  checkAll() {
    this.selectAllChecked = !this.selectAllChecked;

    for (let i = 0; i < this.messageSelected.length; i++) {
      this.messageSelected[i].selected = this.selectAllChecked;
    }
  }

  addToFavorite() {
    this.messageSelected.forEach(email => {
      if (email.selected) {
        const copyOfSelectedMessage: Mail = { ...email };
        this.favoriteEmail.emit(copyOfSelectedMessage);
        email.isFavourite = true;
      }
    });
    this.cdr.markForCheck();
  }
  
  
  markAsImportant() {
    this.messageSelected.forEach(email => {
      if (email.selected) {
        const copyOfSelectedMessage: Mail = { ...email };
        this.importantEmail.emit(copyOfSelectedMessage);
        email.important = true;
      }
    });
    this.cdr.markForCheck();
  }
  

  removeFromfavorite() {
    if (this.selectedMessage) {
      const copyOfSelectedMessage: Mail = { ...this.selectedMessage };
      this.removeFavoriteEmail.emit(copyOfSelectedMessage);
      this.selectedMessage.isFavourite = false;
      console.log('viewer favorite remove');
    }
    for (let i = 0; i < this.messageSelected.length; i++) {
      if (this.messageSelected[i].selected) {
        this.messageSelected[i].isFavourite = false;
      }
    } this.cdr.markForCheck();
  }

  unMarkAsImportant() {
    if (this.selectedMessage) {
      const copyOfSelectedMessage: Mail = { ...this.selectedMessage };
      this.removeImportantEmail.emit(copyOfSelectedMessage);
      this.selectedMessage.important = false;
      console.log('viewer important remove');
    }
    for (let i = 0; i < this.messageSelected.length; i++) {
      if (this.messageSelected[i].selected) {
        this.messageSelected[i].important = false;
      }
    } this.cdr.markForCheck();
  }


  deleteMail(mail:Mail) {
    
      
      this.removeMail.emit(mail);
     
      console.log('list inbox remove');
    
    
    
}


  
}
