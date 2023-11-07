import { Component, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsService } from 'src/app/services/contacts.service';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
  contact?:string;
  isComposeMode:boolean = false;
  writeNewMail:boolean = false

  constructor(private contactsService: ContactsService, private router: Router,public dialog: MatDialog) {}


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

 
  selectContact(contact: string) {
    if (contact) {
      const queryParams = {
        to: contact,
        isContact: true,
        
      };
      this.router.navigate(['/editor'], { queryParams: queryParams });
    }
  }
  
  

  deleteContact(contact: string) {
    const index = this.contacts.indexOf(contact);
  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Conferma eliminazione',
        message: 'Sei sicuro di voler eliminare il contatto?',
      },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (index !== -1) {
          this.contacts.splice(index, 1);
          this.contactsService.setContacts(this.contacts);
        }
      }
    });
  }
  
}
