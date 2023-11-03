import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactsService  {

  contacts = ['manuela@gmail.com',
  'carlobonavita@dgsspa.it']

    private contactsSubject = new BehaviorSubject<any[]>([]);
    contacts$ = this.contactsSubject.asObservable();
  
    setContacts(contacts: string[]) {
      this.contactsSubject.next(contacts);
    }

    constructor(){
      this.setContacts(this.contacts)
    }
}
