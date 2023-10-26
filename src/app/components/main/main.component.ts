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
import { Router, RouterLink } from '@angular/router';
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
    RouterLink,
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
  
  selectedMail: Mail | null = null;
  writeNewMail: boolean = false;
  selectedMails: Mail[] = [];
  showPreviewMail: boolean = false;
  folderSelected: string = 'in box';
  searchTerm = '';

  constructor(
    private folderService: FolderService,
    private dataServ: DataService,
   
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit() {
    this.folderService.selectFolder('all');
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
console.log('dataserv')
    this.dataServ.sendMail(sentMail)
    if (
      !this.folderService
        .getEmails('important')
        .some((existingEmail) => existingEmail.id === sentMail.id)
    ) {
      this.folderService.copyEmailToFolder(sentMail, 'sent');
      
    }
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
    if (!this.folderService
        .getEmails('favorite')
        .some((existingEmail) => existingEmail.id === email.id)
        //spostare controllo folderservice
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

  removeToImportant(email: Mail) {
    
    this.folderService.removeEmailFromFolder(email, 'important');
    if (this.selectedMail && this.selectedMail.id === email.id) {
      this.selectedMail.important = false;
    }
    console.log('main important remove');
  }

  newMail() {
    this.router.navigateByUrl('/editor');
  }

  onSearch(): void {
    console.log('Search Term:', this.searchTerm);
    if (this.searchTerm) {
      this.searchService
        .searchMail(this.searchTerm)
        .subscribe((searchResults) => {
          this.selectedMails = searchResults;
          this.messageListUpdate.emit(this.selectedMails);
        });
      this.searchTerm = '';
    } else {
      const folderName =
        this.folderSelected === 'all' ? 'inbox' : this.folderSelected;
      const emails = this.folderService.getEmails(folderName);
      this.selectedMails = emails.filter(
        (mail) =>
          mail.from.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          mail.subject.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.messageListUpdate.emit(this.selectedMails);
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      this.onSearch();
    }
  }

  removeEmail(mail: Mail): void {
    this.dataServ.deleteEmailData(mail);
  }
  
}
