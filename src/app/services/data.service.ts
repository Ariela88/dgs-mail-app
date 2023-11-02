import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Mail } from '../model/mail';
import { FolderService } from './folder.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient, private folderServ: FolderService) {}

  getMailMessage(): Observable<Mail[]> {
    return this.http.get<Mail[]>('/assets/mail.json').pipe(
      tap((emails: Mail[]) => {
        this.folderServ.setEmails(emails, 'inbox');
      })
    );
  }
}
