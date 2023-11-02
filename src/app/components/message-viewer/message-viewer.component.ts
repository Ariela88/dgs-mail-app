import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mail } from 'src/app/model/mail';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { MessageActionsComponent } from '../message-actions/message-actions.component';
import { FolderService } from 'src/app/services/folder.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavActionsComponent } from '../nav-actions/nav-actions.component';

@Component({
  selector: 'app-message-viewer',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    MessageActionsComponent,
    NavActionsComponent,
  ],
  templateUrl: './message-viewer.component.html',
  styleUrls: ['./message-viewer.component.scss'],
})
export class MessageViewerComponent implements OnInit {
  @Input() writeNewMail: boolean = false;
  @Input() isComposeMode: boolean = false;
  selectedMessage?: Mail | undefined;
  @Output() replyEmail: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Output() forwardEmail: EventEmitter<Mail> = new EventEmitter<Mail>();

  constructor(
    private folderService: FolderService,
    private route: ActivatedRoute,
    private router: Router
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
    this.isComposeMode = true;
    if (this.selectedMessage) {
      const queryParams = {
        to: this.selectedMessage.from,
        subject: 'Re: ' + this.selectedMessage.subject,
        body: 'In risposta al tuo messaggio:\n' + this.selectedMessage.body,
      };

      this.router.navigate(['/editor'], { queryParams: queryParams });
    }
  }

  forwardMail() {
    this.writeNewMail = true;
    this.isComposeMode = true;
    if (this.selectedMessage) {
      const queryParams = {
        subject: 'Inolter: ' + this.selectedMessage.subject,
        body: 'Messaggio inoltrato:\n' + this.selectedMessage.body,
        isForwarding: true,
      };
      this.router.navigate(['/editor'], { queryParams: queryParams });
    }
  }

  addToFavorite(email: Mail) {
    console.log('message viewer favorite');
    console.log(email);

    this.folderService.copyEmailToFolder(email, 'favorite');
    email.folderName = 'favorite';
    email.isFavourite = true;
  }

  isEmailInFavorites(email: Mail): boolean {
    const favoriteEmails = this.folderService.getEmails('favorite');
    return favoriteEmails.some((favorite) => favorite.id === email.id);
  }

  markAsImportant(email: Mail) {
    console.log('message viewer important');
    console.log(email);

    this.folderService.copyEmailToFolder(email, 'important');
    email.folderName = 'important';
    email.important = true;
  }

  
}
