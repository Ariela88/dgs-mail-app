import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SearchService } from './services/search.service';
import { Mail } from './model/mail';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchResolver implements Resolve<Mail[]> {
  constructor(private searchService: SearchService) {}

  resolve(): Observable<Mail[]> {
   
    return this.searchService.searchResults$;
  }
}
