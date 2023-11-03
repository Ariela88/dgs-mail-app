import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactsService  {


    private contactsSubject = new BehaviorSubject<any[]>([]);
    contacts$ = this.contactsSubject.asObservable();
  
    setContacts(contacts: any[]) {
      this.contactsSubject.next(contacts);
    }
}
