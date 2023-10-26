import { Injectable } from '@angular/core';
import { Mail } from '../model/mail';
import { DataService } from './data.service';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private dataService: DataService, private http: HttpClient) {}

  searchMail(searchTerm: string): Observable<Mail[]> {
    return this.http.get<Mail[]>('/assets/mail.json').pipe(
      map((mails: Mail[]) => {
        const searchResults: Mail[] = [];
        mails.forEach((mail) => {
          if (
            mail.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mail.subject.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            const duplicatedMail: Mail = { ...mail };
            searchResults.push(duplicatedMail);
          }
        });
        return searchResults;
      })
    );
  }
}
