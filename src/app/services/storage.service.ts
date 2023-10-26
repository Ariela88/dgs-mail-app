import { Injectable } from '@angular/core';
import { Mail } from '../model/mail';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  saveFavorite(mail: Mail) {
    localStorage.setItem('favorite', JSON.stringify(mail));
  }

  saveSent(mail: Mail) {
    console.log('salvata');
    localStorage.setItem('sent', JSON.stringify(mail));
  }
  saveImportant(mail: Mail) {
    localStorage.setItem('important', JSON.stringify(mail));
  }

  removeFavorite(mail: Mail) {
    localStorage.removeItem('favorite');
    console.log('storage favorite remove');
  }

  removeImportantStorage(mail: Mail) {
    localStorage.removeItem('important');
    console.log('storage important remove');
  }
}
