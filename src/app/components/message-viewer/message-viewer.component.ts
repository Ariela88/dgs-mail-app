import { Component, Input, OnInit } from '@angular/core';
import { Mail } from 'src/app/model/mail';
import { FolderService } from 'src/app/services/folder.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from 'src/app/services/contacts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Contact } from 'src/app/model/contact';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-message-viewer',
  templateUrl: './message-viewer.component.html',
  styleUrls: ['./message-viewer.component.scss'],
})
export class MessageViewerComponent implements OnInit {
  @Input() writeNewMail: boolean = false;
  @Input() isComposeMode: boolean = false;
  selectedMessage?: Mail | undefined;
  isEditing: boolean = false;

  constructor(
    private folderService: FolderService,
    private route: ActivatedRoute,
    private router: Router,
    private contactServ: ContactsService,
    private snackBar: MatSnackBar,
    private dataServ: DataService
  ) {}
  ngOnInit() {
    const mailId = this.route.snapshot.params['id'];
    const folderName = this.route.snapshot.params['folderName'];
    this.folderService
      .getEmailsObservable(folderName)
      .forEach((data: Mail[]) => {
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
      });
  }

  replyToEmail() {
    this.writeNewMail = true;
    this.isComposeMode = false;
    if (this.selectedMessage) {
      const queryParams = {
        emailData: JSON.stringify(this.selectedMessage),
        isReply: true,
      };
      this.router.navigate(['/editor'], { queryParams: queryParams });
    }
  }

  forwardMail() {
    this.writeNewMail = true;
    this.isComposeMode = false;
    if (this.selectedMessage) {
      const queryParams = {
        emailData: JSON.stringify(this.selectedMessage),
        isForwarding: true,
      };
      this.router.navigate(['/editor'], { queryParams: queryParams });
    }
  }

  addToFavorites(email: Mail): void {
    email.folderName = 'favorite';
    email.isFavourite = true;
    this.folderService.copyEmailToFolder(email, 'favorite');
    this.dataServ.putMailMessage(email).subscribe((updatedEmail) => {
      email = updatedEmail;
    });
  }

  markAsImportant(email: Mail): void {
    email.folderName = 'important';
    email.important = true;
    this.folderService.copyEmailToFolder(email, 'important');
    this.dataServ.putMailMessage(email).subscribe((updatedEmail) => {
      email = updatedEmail;
    });
  }

  removeFromFavorites(email: Mail): void {
    console.log('Rimuovi dai preferiti:', email);

    email.folderName = 'inbox';
    email.isFavourite = false;
  }

  removeAsImportant(email: Mail): void {
    console.log('Rimuovi importante:', email);
    email.folderName = 'inbox';
    email.important = false;
  }

  toggleImportant(email: Mail): void {
    if (this.isEmailImportant(email)) {
      this.removeAsImportant(email);
      email.important = false;
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
    let isImportant = false;
    this.folderService.getEmails('important').subscribe((importantEmails) => {
      isImportant = importantEmails.some(
        (important) => important.id === email.id
      );
    });
    return isImportant;
  }

  isEmailInFavorites(email: Mail): boolean {
    let isInFavorites = false;
    this.folderService.getEmails('favorite').subscribe((favoriteEmails) => {
      isInFavorites = favoriteEmails.some(
        (favorite) => favorite.id === email.id
      );
    });
    return isInFavorites;
  }

  addEmail() {
    if (this.selectedMessage) {
      const senderEmail = this.selectedMessage.from;
      const newContact: Contact = {
        email: senderEmail,
        isFavourite: false,
        isContact: true,
        isSelected: false,
      };
      if (!this.contactServ.isContactInRubrica(newContact)) {
        this.contactServ.addContact(newContact);
        console.log('Email aggiunta alla rubrica:', senderEmail);
        this.snackBar.open('Contatto aggiunto alla rubrica', 'Chiudi', {
          duration: 2000,
        });
      } else {
        console.log('Il contatto è già presente nella rubrica.');
        this.snackBar.open(
          'Il contatto è già presente nella rubrica',
          'Chiudi',
          {
            duration: 2000,
          }
        );
      }
    }
  }

  createContactFromSelectedMessage(): Contact {
    if (this.selectedMessage) {
      return {
        email: this.selectedMessage.from,
        isFavourite: false,
        isContact: true,
        isSelected: false,
      };
    }
    throw new Error('Messaggio non selezionato.');
  }

  toggleEditing() {
    this.isEditing = true;
    this.writeNewMail = true;
    this.isComposeMode = false;
    if (this.isEditing && this.selectedMessage) {
      const queryParams = {
        emailData: JSON.stringify(this.selectedMessage),
        isEditing: true,
      };
      this.router.navigate(['editor'], { queryParams: queryParams });
    }
  }
}
