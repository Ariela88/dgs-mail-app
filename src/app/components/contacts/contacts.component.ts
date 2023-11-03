import { Component, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsService } from 'src/app/services/contacts.service';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent {
  contacts: string[] = [
    
  ];

  newContactEmail: string = '';

  constructor(private contactsService: ContactsService) {}

  ngOnInit() {
    this.contactsService.contacts$.subscribe(contacts => {
      this.contacts = contacts;
      console.log('rubrica',contacts)
    });
  }
  

  addNewContact() {
    if (this.newContactEmail && !this.contacts.includes(this.newContactEmail)) {
      this.contacts.push(this.newContactEmail);
      this.contactsService.setContacts(this.contacts);
      this.newContactEmail = '';
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
      alert('L\'indirizzo email non è valido.');
    }
  }
}
