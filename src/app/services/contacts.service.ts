import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  contacts = [
    'carlobonamico@dgsspa.it',
    'Emmanuelbreakable@frontiernet.net',
    'Justinreal@sympatico.ca',
    'dangerousJon87@yahoo.it',
    'blue-eyedMark@hetnet.nl',
    'betterCharlotte4@live.co.uk',
    'kindAnn58@sfr.fr',
    'thoughtlessThomas55@yahoo.de',
    'Tammyarrogant@att.net',
    'soreSarah@yahoo.com',
    'nuttyBethany69@mail.ru',
  ];
  private selectedRecipientSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  public selectedRecipient$: Observable<string> =
    this.selectedRecipientSubject.asObservable();

  private contactsSubject = new BehaviorSubject<any[]>([]);
  contacts$ = this.contactsSubject.asObservable();

  setContacts(contacts: string[]) {
    this.contactsSubject.next(contacts);
  }

  getContact(): string[] {
    return this.contacts;
  }

  constructor() {
    this.setContacts(this.contacts);
  }

  addContact(contact: string): void {
    this.contacts.push(contact);
    this.contactsSubject.next(this.contacts);
  }

  getSelectedRecipient(): string | null {
    return this.selectedRecipientSubject.value;
  }
}
