import {Component,EventEmitter,HostListener,Input,Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { FolderListComponent } from '../folder-list/folder-list.component';
import { MessageListComponent } from '../message-list/message-list.component';
import { MessageViewerComponent } from '../message-viewer/message-viewer.component';
import { FolderService } from 'src/app/services/folder.service';
import { ComposeComponent } from '../compose/compose.component';
import { DataService } from 'src/app/services/data.service';
import { FormsModule } from '@angular/forms';
import { Mail } from 'src/app/model/mail';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

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
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  selectedMail: Mail | null = null;
  selectedMails: Mail[] = [];
  @Output() messageOpened = new EventEmitter<Mail>();
  @Output() messageListUpdate = new EventEmitter<Mail[]>();
  writeNewMail: boolean = false;
  showPreviewMail: boolean = false;
  isComposeMode: boolean = false;
  folderSelected: string = 'in box';
  searchTerm = '';
  @Output() searchEvent = new EventEmitter<string>();
  @Input() isFavourite: boolean = false;
  favoriteEmails: Mail[] = [];

  constructor(
    private folderService: FolderService,
    private dataServ: DataService,
  
  ) {}

  ngOnInit() {
    this.folderService.selectFolder('inbox');
    this.dataServ.getMailMessage().subscribe(
      (data: Mail[]) => {
        this.selectedMails = data;
        this.selectedMails.forEach((email) => {
          this.folderService.addEmailToFolder(email);
        });
      },
      (error) => {
        console.error('Error fetching mail data: ', error);
      }
    );

    this.dataServ.sentMail$.subscribe((mail) => {
      if (mail) {
        this.onSentMail(mail);
      }
    });

    
  }

  onMessageSelected(mail: Mail) {
    this.selectedMail = mail;
    this.isComposeMode = false;
  }


  onFolderSelected(folderName: string) {
    this.folderService.selectFolder(folderName);
    this.selectedMails = this.folderService.getEmails(folderName);
    this.messageListUpdate.emit(this.selectedMails);
    this.folderSelected = folderName;
  }


  onSentMail(sentMail: Mail) {
    this.folderService.moveEmailToFolder(sentMail, 'sent');
  }

  onImportantEmailSelected(email: Mail) {
    if (!this.folderService.getEmails('important').some(existingEmail => existingEmail.id === email.id)) {
      this.folderService.moveEmailToFolder(email, 'important');
    }
  }

  
  onFavoriteEmailSelected(email: Mail) {
    if (!this.folderService.getEmails('favorites').some(existingEmail => existingEmail.id === email.id)) {
    this.folderService.moveEmailToFolder(email, 'favorites');
  }}


  toggleNewMail() {
    this.writeNewMail = !this.writeNewMail;
    this.isComposeMode = this.writeNewMail;
  }

  onSearch(): void {
    if (this.searchTerm) {
      this.dataServ.searchMail(this.searchTerm).subscribe((filteredMails) => {
        this.selectedMails = filteredMails;
        this.messageListUpdate.emit(this.selectedMails);
      });
      this.searchTerm = '';
    } else {
      const folderNames = ['inbox', 'favorites', 'important', 'sent']; 
      const searchResults: Mail[] = [];
      folderNames.forEach(folderName => {
        const emails = this.folderService.getEmails(folderName);
        searchResults.push(...emails.filter(mail =>
          mail.from.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          mail.subject.toLowerCase().includes(this.searchTerm.toLowerCase())
        ));
      });
      this.selectedMails = searchResults;
      this.messageListUpdate.emit(this.selectedMails);
    }
  }
  

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      this.onSearch();
    }
  }
}
