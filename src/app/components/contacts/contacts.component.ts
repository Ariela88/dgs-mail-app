import { Component, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent {
  @Output() contacts = [
    { name: 'Manuela', email: 'manuela@gmail.com' },
    { name: 'Carlo', email: 'carlobonavita@dgsspa.it' },
  ];

  constructor(private contactsService: ContactsService) {}

  ngOnInit() {
   
    
    this.contactsService.setContacts(this.contacts);
  }




}
