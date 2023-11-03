import { Component, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsService } from 'src/app/services/contacts.service';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  selectedMessage?:string

  constructor(private contactsService: ContactsService, private router: Router) {}


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

  selectMail() {
    for (let i = 0; i < this.contacts.length; i++) {
      const mail = this.contacts[i];
  
      if (mail) {
        console.log('select mail', mail);
        const queryParams = {       
          to: mail,
        };       
        this.router.navigate(['/editor'], { queryParams: queryParams });
       
        break;
      }
    }
  }
  
  
}
