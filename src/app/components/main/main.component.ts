import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { FolderListComponent } from '../folder-list/folder-list.component';
import { MessageListComponent } from '../message-list/message-list.component';
import { MessageViewerComponent } from '../message-viewer/message-viewer.component';
import { MessageActionsComponent } from '../message-actions/message-actions.component';
import { FolderService } from 'src/app/services/folder.service';
import { ComposeComponent } from '../compose/compose.component';
import { DataService } from 'src/app/services/data.service';
import { FormsModule } from '@angular/forms';
import { Mail } from 'src/app/model/mail';

import { SearchService } from 'src/app/services/search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FolderListComponent,
    MessageListComponent,
    MessageViewerComponent,
    ComposeComponent,
    FormsModule,

    MessageActionsComponent,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  @Output() searchEvent = new EventEmitter<string>();
  @Output() messageOpened = new EventEmitter<Mail>();
  @Output() messageListUpdate = new EventEmitter<Mail[]>();
  @Input() isComposeMode: boolean = false;
  @Input() writeNewMail: boolean = false;
  @Output() replyMail: EventEmitter<void> = new EventEmitter<void>();
  @Output() inolterAMail: EventEmitter<void> = new EventEmitter<void>();
  

  selectedMail: Mail | null = null;

  selectedMails: Mail[] = [];
  showPreviewMail: boolean = false;
  folderSelected: string = 'in box';
  searchTerm = '';
 

  constructor(
    private folderService: FolderService,
    private dataServ: DataService,
    private searchService: SearchService,
    private router: Router
  ) {
    const searchResults = this.searchService.searchMail(this.searchTerm);
    this.selectedMails = searchResults;
  }

  ngOnInit() {
    

    this.dataServ.getMailMessage().subscribe(
      (data: Mail[]) => {
      this.selectedMails = [...data, ...this.dataServ.sentEmails];
        this.selectedMails.forEach((email) => {
          this.folderService.addEmailToFolder(email);
        });
      },
      (error) => {
        console.error('Error fetching mail data: ', error);
      }
    );
  }




  onMessageSelected(mail: Mail) {
    this.selectedMail = mail;
    this.isComposeMode = false;
    this.selectedMail.isFavourite = this.folderService
      .getEmails('favorite')
      .some((existingEmail) => existingEmail.id === mail.id);
    this.selectedMail.important = this.folderService
      .getEmails('important')
      .some((existingEmail) => existingEmail.id === mail.id);
    this.selectedMail.sent = this.folderService
      .getEmails('sent')
      .some((existingEmail) => existingEmail.id === mail.id);
  }


  onFolderSelected(folderName: string) {
    this.folderService.selectFolder(folderName);
    this.selectedMails = this.folderService.getEmails(folderName);
    this.messageListUpdate.emit(this.selectedMails);
    this.folderSelected = folderName;
  }

  onEmailSent(sentMail: Mail) {
    this.folderService.copyEmailToFolder(sentMail, 'sent');
    this.isComposeMode = false
  }

  onImportantEmailSelected(email: Mail) {
    if (
      !this.folderService
        .getEmails('important')
        .some((existingEmail) => existingEmail.id === email.id)
    ) {
      this.folderService.copyEmailToFolder(email, 'important');
    }
  }

  onFavoriteEmailSelected(email: Mail) {
    if (
      !this.folderService
        .getEmails('favorite')
        .some((existingEmail) => existingEmail.id === email.id)
    ) {
      this.folderService.copyEmailToFolder(email, 'favorite');
    }
  }

  removeToFavorite(email: Mail) {
    this.folderService.removeEmailFromFolder(email, 'favorite');
    if (this.selectedMail && this.selectedMail.id === email.id) {
      this.selectedMail.isFavourite = false;
      console.log('main favorite remove');
    }
  }


  removeEmailToInBox(email: Mail) {
    console.log('main remove')
    this.folderService.removeEmailFromFolder(email, 'inbox');

    
  }


  removeToImportant(email: Mail) {

    this.folderService.removeEmailFromFolder(email, 'important');
    if (this.selectedMail && this.selectedMail.id === email.id) {
      this.selectedMail.important = false;
    }
    console.log('main important remove');
  }

  toggleNewMail() {
    this.writeNewMail = !this.writeNewMail;
    this.isComposeMode = this.writeNewMail; 
  }

  onSearch(): void {
    console.log('Ricerca mail nel main', this.searchTerm);
    if (this.searchTerm) {
      const searchResults = this.searchService.searchMail(this.searchTerm);
      this.selectedMails = searchResults;
      this.messageListUpdate.emit(this.selectedMails);
    } else {
      const folderName = 'all'
      this.selectedMails = this.folderService.getEmails(folderName);
      this.messageListUpdate.emit(this.selectedMails);
    }
  }

  reply() {
    if (this.selectedMail) {
      const emailToSend: Mail = {
        to: this.selectedMail.from, 
        from: this.selectedMail.to,
        subject: 'RE: ' + this.selectedMail.subject,
        body: 'In risposta al tuo messaggio:\n' + this.selectedMail.body,
        id: '', 
        sent: true,
        important: false,
        isFavourite: false,
        completed: false,
        selected: false
      };
      this.onEmailSent(emailToSend);
      this.isComposeMode = true; 
    } else {
      console.error('Valori mancanti per "to" o "from" nel messaggio selezionato.');
    }
  }
  
  
  
  

  inolter() {
    
    if (this.selectedMail) {
      const queryParams = {
        from: this.selectedMail.to,
        to: '',
        subject: '(Inoltrato) ' + this.selectedMail.subject,
        body: this.selectedMail.body,
      };

      const emailToSend: Mail = {
        to: this.selectedMail.from,
        from: this.selectedMail.to,
        subject: 'Inoltrato ' + this.selectedMail.subject,
        body: '',
        id: '9',
        sent: true,
        important: false,
        isFavourite: false,
        completed: false,
        selected: false
      };
  
      this.onEmailSent(emailToSend);
      this.isComposeMode = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      this.onSearch();
    }
  }
}