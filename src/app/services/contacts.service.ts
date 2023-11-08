import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from '../model/contact';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  contacts:Contact[] = []
  private contactsSubject: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);
  contacts$: Observable<Contact[]> = this.contactsSubject.asObservable();
  private selectedRecipientSubject: BehaviorSubject<string> =
  new BehaviorSubject<string>('');
public selectedRecipient$: Observable<string> =
  this.selectedRecipientSubject.asObservable();

  constructor(private http:HttpClient){
    this.loadContacts();;
  }

  private loadContacts() {
    this.http.get<Contact[]>('/assets/contacts.json').subscribe(
      (contacts: Contact[]) => {
        this.contactsSubject.next(contacts);
      },
      (error) => {
        console.error('Errore durante il caricamento dei contatti:', error);
      }
    );
  }
  
 
  
  
   

    setContacts(contacts: Contact[]): void {
      const sortedContacts = contacts.slice().sort((a, b) => (b.isFavourite ? 1 : -1));
      this.contactsSubject.next(sortedContacts);
      this.contactsSubject.next(contacts)
    }
  
    getContacts(): Contact[] {
      return this.contactsSubject.getValue();
    }

  

  addContact(contact: Contact): void {
    this.contacts.push(contact)
    this.contactsSubject.next(this.contacts)
    
    
  }
  

  getSelectedRecipient(): string | null {
    return this.selectedRecipientSubject.value;
  }

  
}
