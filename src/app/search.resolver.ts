import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import { SearchService } from './services/search.service';
import { Mail } from './model/mail';

@Injectable({
  providedIn: 'root'
})
export class SearchResolver implements Resolve<Mail[]> {

  constructor(private searchServ: SearchService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Mail[]> {
    const searchTerm = route.queryParams['q'];    
    return this.searchServ.searchResults$.pipe( 
      map(emails => {
        const searchResults = emails.filter(mail => 
          mail.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mail.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mail.body.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return searchResults;
      })
    );
  }
}
