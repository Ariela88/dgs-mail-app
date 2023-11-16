import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from '../model/contact';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {

  contacts: Contact[] = [];
  contactsSubject: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);
  contacts$: Observable<Contact[]> = this.contactsSubject.asObservable();
  selectedRecipientSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  selectedRecipient$: Observable<string> = this.selectedRecipientSubject.asObservable();

  constructor(private http: HttpClient) {this.loadContacts();}

  loadContacts() {
    this.http.get<Contact[]>('/assets/contacts.json').subscribe(
      (contacts: Contact[]) => {
        this.setContacts(contacts);
         },
          (error) => {
           console.error('Errore durante il caricamento dei contatti:', error);
            }
             );
              }

  setContacts(contacts: Contact[]): void {
    const sortedContacts = contacts
      .slice()
        .sort((a, b) => (b.isFavourite ? 1 : -1));
            this.contactsSubject.next(sortedContacts);
              }


  getContacts(): Contact[] {
    return this.contactsSubject.getValue();
      }

  addContact(contact: Contact): void {
    if (!this.contactsSubject.getValue().some((c) => c.email === contact.email)) 
     { 
      const currentContacts = this.contactsSubject.getValue();
       const updatedContacts = [...currentContacts, contact];
        this.contactsSubject.next(updatedContacts);        
         } else {
          console.log('Il contatto è già presente nella rubrica.');
           }
            }

  isContactInRubrica(newContact: Contact): boolean {
    return this.contactsSubject.getValue().some(c => c.email === newContact.email);
     }
  

  getSelectedRecipient(): string | null {
    return this.selectedRecipientSubject.value;
      }
}
