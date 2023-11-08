import { Component, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsService } from 'src/app/services/contacts.service';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Contact } from 'src/app/model/contact';
import { MessageActionsComponent } from "../message-actions/message-actions.component";


@Component({
    selector: 'app-contacts',
    standalone: true,
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss'],
    imports: [CommonModule, MaterialModule, FormsModule, MessageActionsComponent]
})
export class ContactsComponent {
  contacts: Contact[] = [];
contact?:Contact;
  newContactEmail: string = '';
 
  isComposeMode: boolean = false;
  writeNewMail: boolean = false;
  inContact = true

  constructor(
    private contactsService: ContactsService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.contactsService.contacts$.subscribe((contacts) => {
      this.contacts = contacts;
      console.log('rubrica', contacts);
    });
  }

  addNewContact() {
    if (this.newContactEmail && this.isEmailValid(this.newContactEmail)) {
      const newContact: Contact = {
        email: this.newContactEmail,
        isFavourite: false,
        isContact:true,
        isSelected:false      };
  
      if (!this.contacts.find(contact => contact.email === newContact.email)) {
        this.contacts.push(newContact);
        this.contactsService.setContacts(this.contacts);
        this.newContactEmail = '';
      } else {
        alert('Questo contatto è già presente nella rubrica.');
      }
    } else {
      alert("L'indirizzo email non è valido.");
    }
  }
  

  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  addContact() {
    if (this.newContactEmail && this.isEmailValid(this.newContactEmail)) {
      this.addNewContact();
    } else {
      alert("L'indirizzo email non è valido.");
    }
  }

  selectContact(contact: Contact) {
    if (contact) {
      const queryParams = {
        to: contact.email,
        isContact: true,
      };
      this.router.navigate(['/editor'], { queryParams: queryParams });
    }
  }
  
  

  deleteContact(contact: Contact) {
    const index = this.contacts.indexOf(contact);
  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Conferma eliminazione',
        message: 'Sei sicuro di voler eliminare il contatto?',
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (index !== -1) {
          this.contacts.splice(index, 1);
          this.contactsService.setContacts(this.contacts);
        }
      }
    });
  }
  
  toggleFavorite(contact: Contact) {
    contact.isFavourite = !contact.isFavourite;
    this.contactsService.setContacts(this.contacts); 
  }
  
  
  
}
