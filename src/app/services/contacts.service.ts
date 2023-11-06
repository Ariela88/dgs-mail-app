import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactsService  {

  contacts = [

    
  'manuela@gmail.com',
  'carlobonamico@dgsspa.it']
  private selectedRecipientSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public selectedRecipient$: Observable<string> = this.selectedRecipientSubject.asObservable();

    private contactsSubject = new BehaviorSubject<any[]>([]);
    contacts$ = this.contactsSubject.asObservable();
  
    setContacts(contacts: string[]) {
      this.contactsSubject.next(contacts);
    }

    getContact(): string[] {
      return this.contacts;
    }

    constructor(){
      this.setContacts(this.contacts)
    }

    addContact(contact: string): void {
      this.contacts.push(contact);
      this.contactsSubject.next(this.contacts);
    }

    getSelectedRecipient(): string | null {
      return this.selectedRecipientSubject.value;
    }
}
