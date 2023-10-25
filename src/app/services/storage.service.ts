import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Mail } from '../model/mail';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  localStorageKey = 'favourites';
  private favouritesSubject = new BehaviorSubject<Mail[]>(
    this.getMailsFromLocalStorage()
  );
  favourites$ = this.favouritesSubject.asObservable();

  constructor() {
    const storedMails = this.getMailsFromLocalStorage();
    this.favouritesSubject.next(storedMails);
  }

  getMailsFromLocalStorage(): Mail[] {
    const storedMails = localStorage.getItem(this.localStorageKey);
    return storedMails ? JSON.parse(storedMails) : [];
  }

  saveMailInFavourites(mail: Mail) {
    if (!this.isFavourite(mail)) {
      const updatedFavourites = [...this.favouritesSubject.value, mail];
      this.favouritesSubject.next(updatedFavourites);
      localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(updatedFavourites)
      );
    }
  }

  removeMailToFavourites(mail: Mail): void {
    const updatedFavourites = this.favouritesSubject.value.filter(
      (b) => b.id !== mail.id
    );
    this.favouritesSubject.next(updatedFavourites);
    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(updatedFavourites)
    );
  }

  isFavourite(mail: Mail): boolean {
    const favouritesArray = this.favouritesSubject.value;
    return favouritesArray.some((m) => m.id === mail.id);
  }
}
