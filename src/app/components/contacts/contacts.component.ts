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
import { ContactActionsComponent } from "../contact-actions/contact-actions.component";


@Component({
    selector: 'app-contacts',
    standalone: true,
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss'],
    imports: [CommonModule, MaterialModule, FormsModule, MessageActionsComponent, ContactActionsComponent]
})
export class ContactsComponent {
  contacts: Contact[] = [];
contact?:Contact;
  newContactEmail: string = '';
  selectedContacts: Contact[] = [];
  selectedContact?: Contact;
  selectAll: boolean = false;
 
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
    const updatedContacts = this.contacts.map(c => {
      if (c.email === contact.email) {
        return { ...c, isFavourite: !c.isFavourite };
      }
      return c;
    });
  
    this.contactsService.setContacts(updatedContacts);
  }
  
  
  
  
  

  toggleSelectAll() {
    this.contacts.forEach(contact => contact.isFavourite = this.selectAll);
    this.contactsService.setContacts(this.contacts);
  }
  
 

  handleCheckboxChange(contact: Contact) {
    
    if (!contact.isSelected) {
      contact.isSelected = true;
    }
  }
  
  addFavorites() {
    const selectedContacts = this.contacts.filter(contact => contact.isSelected);
    
    selectedContacts.forEach(contact => {
      contact.isFavourite = !contact.isFavourite; 
      contact.isSelected = false; 
    });
    
    this.contactsService.setContacts(this.contacts);
  }
  
  
  getButtonText(): string {
    const selectedContacts = this.contacts.filter(contact => contact.isSelected && contact.isFavourite);
    if (selectedContacts.length > 0) {
      return 'Rimuovi dai preferiti';
    } else {
      return 'Aggiungi ai preferiti';
    }
  }
  
  
  
  
  
}
