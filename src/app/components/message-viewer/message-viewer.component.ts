import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mail } from 'src/app/model/mail';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { FolderService } from 'src/app/services/folder.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavActionsComponent } from '../nav-actions/nav-actions.component';
import { MessageActionsComponent } from '../message-actions/message-actions.component';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-message-viewer',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    NavActionsComponent,
    MessageActionsComponent,
  ],
  templateUrl: './message-viewer.component.html',
  styleUrls: ['./message-viewer.component.scss'],
})
export class MessageViewerComponent implements OnInit {
  @Input() writeNewMail: boolean = false;
  @Input() isComposeMode: boolean = false;
  selectedMessage?: Mail | undefined;

  @Output() addEmailContacts = new EventEmitter<string[]>
  
  constructor(
    private folderService: FolderService,
    private route: ActivatedRoute,
    private router: Router,
    private contactServ:ContactsService
  ) {}

  ngOnInit() {
    const mailId = this.route.snapshot.params['id'];
    const folderName = this.route.snapshot.params['folderName'];

    this.folderService.getEmailsObservable(folderName).subscribe(
      (data: Mail[]) => {
        if (data && data.length > 0) {
          this.selectedMessage = data.find((mail) => mail.id === mailId);
          if (this.selectedMessage) {
            console.log('Messaggio trovato:', this.selectedMessage);
          } else {
            console.log('Messaggio non trovato con ID:', mailId);
          }
        } else {
          console.log('Nessun messaggio trovato nella cartella:', folderName);
        }
      },
      (error) => {
        console.error('Errore durante il recupero dei messaggi:', error);
      }
    );
  }

  replyToEmail() {
    this.writeNewMail = true;
    this.isComposeMode = false;
    if (this.selectedMessage) {
      const queryParams = {
        to: this.selectedMessage.from,
        subject: 'Re: ' + this.selectedMessage.subject,
      };

      this.router.navigate(['/editor'], { queryParams: queryParams });
    }
  }

  forwardMail() {
    this.writeNewMail = true;
    this.isComposeMode = false;
    if (this.selectedMessage) {
      const queryParams = {
        subject: 'Inolter: ' + this.selectedMessage.subject,
        body: 'Inoltrato:' + '(' + this.selectedMessage.body + ')',
        isForwarding: true,
      };
      this.router.navigate(['/editor'], { queryParams: queryParams });
    }
  }



  addToFavorites(email: Mail): void {
   
    this.folderService.copyEmailToFolder(email, 'favorite');
    email.folderName = 'favorite';
    email.isFavourite = true;
  }

  markAsImportant(email: Mail): void {
    
    this.folderService.copyEmailToFolder(email, 'important');
    email.folderName = 'important';
    email.important = true;
  }


  removeFromFavorites(email: Mail): void {
    console.log('Rimuovi dai preferiti:', email);
    this.folderService.removeEmailFromFolder(email.id, 'favorite');
    email.folderName = 'inbox';
    email.isFavourite = false;
  }

  removeAsImportant(email: Mail): void {
    console.log('Rimuovi importante:', email);
    this.folderService.removeEmailFromFolder(email.id, 'important');
    email.folderName = 'inbox';
    email.important = false;
  }
 

  toggleImportant(email: Mail): void {
    if (this.isEmailImportant(email)) {
      this.removeAsImportant(email);
    } else {
      this.markAsImportant(email);
    }
  }

  toggleFavorite(email: Mail): void {
    if (this.isEmailInFavorites(email)) {
      this.removeFromFavorites(email);
    } else {
      this.addToFavorites(email);
    }
  }


 

  isEmailImportant(email: Mail): boolean {
    const importantEmails = this.folderService.getEmails('important');
    return importantEmails.some((important) => important.id === email.id);
  }

  isEmailInFavorites(email: Mail): boolean {
    const favoriteEmails = this.folderService.getEmails('favorite');
    return favoriteEmails.some((favorite) => favorite.id === email.id);
  }

  addEmail() {
    if (this.selectedMessage) {
      const senderEmail = this.selectedMessage.from;
      const contacts = this.contactServ.contacts;
  
      if (!contacts.includes(senderEmail)) {
        this.contactServ.addContact(senderEmail);
        console.log('Email aggiunta alla rubrica:', senderEmail);
      } else {
        console.log('Email già presente nella rubrica:', senderEmail);
        
      }
    }
  }
}
