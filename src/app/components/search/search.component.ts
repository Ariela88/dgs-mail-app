import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  recentSearchTerms: string[] = [];
  searchTerm = '';
  @ViewChild('elementoRicerca') elementoRicerca!: ElementRef;
  useMockApi = false;
  searchByDate = false
  formGroup: FormGroup;
  @Input() selectedDate = new Date()
  disableDatesAfterToday = true
  

  constructor(private router: Router, private searchServ: SearchService,private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      selectedDate: [new Date()],
      disabledDates: [[]],
     
    });
  }

  ngOnInit(): void {
    const savedSearchTerms = localStorage.getItem('recentSearchTerms');
    this.recentSearchTerms = savedSearchTerms
      ? JSON.parse(savedSearchTerms)
      : [];
  }

  filterSearchTerms(inputValue: string): string[] {
    return this.recentSearchTerms.filter((searchTerm) =>
      searchTerm.toLowerCase().includes(inputValue.toLowerCase())
    );
  }

  onSearch() {
  if (this.useMockApi) {
    this.searchServ.searchMailInMockapi(this.searchTerm);
  } else if (this.searchByDate) {
    const selectedDate = this.formGroup.get('selectedDate')?.value;
    this.searchServ.searchMailByDate(selectedDate);
    
  } else {
    this.searchServ.searchMail(this.searchTerm);
  }
  this.addRecentSearch(this.searchTerm);
  this.router.navigate(['folder/results'], {
    queryParams: { q: this.searchTerm },
  });
  this.searchTerm = '';
}


  addRecentSearch(query: string): void {
    const MAX_RECENT_SEARCHES = 10;
    if (!this.recentSearchTerms.includes(query)) {
      this.recentSearchTerms.unshift(query);
      if (this.recentSearchTerms.length > MAX_RECENT_SEARCHES) {
        this.recentSearchTerms.pop();
      }
      localStorage.setItem(
        'recentSearchTerms',
        JSON.stringify(this.recentSearchTerms)
      );
    }
  }

  insertInInput(term: string) {
    this.searchTerm = term;
    if (this.searchTerm) {
      this.onSearch();
      this.searchTerm = '';
    }
  }
}
