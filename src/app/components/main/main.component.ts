import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
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
  @Input() isComposeMode: boolean = false;
  @Input() writeNewMail: boolean = false;

  @Output() searchEvent = new EventEmitter<string>();
  @Output() messageOpened = new EventEmitter<Mail>();
  @Output() messageListUpdate = new EventEmitter<Mail[]>();
  @Output() replyMail: EventEmitter<void> = new EventEmitter<void>();
  @Output() inolterAMail: EventEmitter<void> = new EventEmitter<void>();
  @Output() deleteEmailToInbox: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(ComposeComponent) composeComponent?: ComposeComponent;

  selectedMail: Mail | null = null;
  selectedMails: Mail[] = [];
  showPreviewMail: boolean = false;
  folderSelected: string = 'in box';
  searchTerm = '';

  constructor(
    private folderService: FolderService,
    private dataServ: DataService,
    private searchService: SearchService
  ) {
    const searchResults = this.searchService.searchMail(this.searchTerm);
    this.selectedMails = searchResults;
    this.folderService.emailRemoved$.subscribe(() => {
      this.messageListUpdate.emit(this.selectedMails);
    });
  }

  ngOnInit() {
    const foldername = ''
    this.dataServ.getMailMessage().subscribe(
      (data: Mail[]) => {
        this.selectedMails = [...data, ...this.dataServ.sentEmails];
        this.selectedMails.forEach((email) => {
          this.folderService.addEmailToFolder(email,foldername);
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
    if (folderName === 'all') {
      this.selectedMails = this.folderService.getAllEmails();
    } else {
      this.folderService.selectFolder(folderName);
      this.selectedMails = this.folderService.getEmails(folderName);
    }
    this.messageListUpdate.emit(this.selectedMails);
    this.folderSelected = folderName;
  }

  onEmailSent(sentMail: Mail) {
    this.folderService.copyEmailToFolder(sentMail, 'sent');
    this.folderService.copyEmailToFolder(sentMail, 'all');
    this.isComposeMode = false;
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
    }
  }

  removeEmailToInBox(email: Mail) {
    if (
      !this.folderService
        .getEmails('trash')
        .some((existingEmail) => existingEmail.id === email.id)
    ) {
      this.folderService.removeEmailFromFolder(email, 'inbox');
    }
    this.messageListUpdate.emit(
      this.selectedMails.filter((item) => item.id !== email.id)
    );
    this.selectedMails = this.selectedMails.filter(
      (item) => item.id !== email.id
    );
  }

  removeToImportant(email: Mail) {
    this.folderService.removeEmailFromFolder(email, 'important');
    if (this.selectedMail && this.selectedMail.id === email.id) {
      this.selectedMail.important = false;
    }
  }

 

  resetComposeForm() {
    this.searchTerm = '';
    this.selectedMails = this.folderService.getEmails('inbox');
    this.selectedMail = null;
    this.composeComponent?.resetForm();
  }

  onSearch(): void {
    if (this.searchTerm) {
      const searchResults = this.searchService.searchMail(this.searchTerm);
      this.selectedMails = searchResults;
      this.messageListUpdate.emit(this.selectedMails);
    } else {
      const folderName = 'all';
      this.selectedMails = this.folderService.getEmails(folderName);
      this.messageListUpdate.emit(this.selectedMails);
    }
  }

  reply() {
    if (this.selectedMail) {
      this.isComposeMode = true;
    }
  }

  inolter() {
    if (this.selectedMail) {
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
