import { Component } from '@angular/core';
import { ContactsService } from 'src/app/services/contacts.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Contact } from 'src/app/model/contact';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
    selector: 'app-contacts',
    
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss']
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
    public dialog: MatDialog,
    private snackBar:MatSnackBar
  ) {}

  ngOnInit() {
    this.contactsService.contacts$.subscribe((contacts) => {
      this.contacts = contacts;
     // console.log('rubrica', contacts);
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
      this.snackBar.open('Contatto aggiunto alla rubrica', 'Chiudi', {
        duration: 2000,
      });
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
  
  

  deleteSelectedContacts() {
    const selectedContacts = this.contacts.filter(contact => contact.isSelected);

    if (selectedContacts.length > 0) {
      const confirmDelete = window.confirm('Sei sicuro di voler eliminare i contatti selezionati?');

      if (confirmDelete) {
        this.contacts = this.contacts.filter(contact => !contact.isSelected);
        this.contactsService.setContacts(this.contacts);
        this.snackBar.open('Contatto Eliminato', 'Chiudi', {
          duration: 2000,
        });
      }
    } else {
      alert('Seleziona almeno un contatto da eliminare.');
    }
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
