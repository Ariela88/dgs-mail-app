import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from 'src/app/services/search.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  recentSearchTerms: string[] = [];
  @Output() searchInputChange: EventEmitter<string> = new EventEmitter<string>();
  searchTerm = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const savedSearchTerms = localStorage.getItem('recentSearchTerms');
    this.recentSearchTerms = savedSearchTerms ? JSON.parse(savedSearchTerms) : [];
  }

  onSearchInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    this.searchInputChange.emit(inputValue);
    this.getFilteredSuggestions(inputValue);
  }

  onSearch() {
    this.router.navigate(['/results'], { queryParams: { q: this.searchTerm } });
    this.addRecentSearch(this.searchTerm)
    
  }

  getFilteredSuggestions(query: string): void {
    
    
  }

  addRecentSearch(query: string): void {
    const MAX_RECENT_SEARCHES = 10;
    if (!this.recentSearchTerms.includes(query)) {
      this.recentSearchTerms.unshift(query);
      if (this.recentSearchTerms.length > MAX_RECENT_SEARCHES) {
        this.recentSearchTerms.pop();
      }
      localStorage.setItem('recentSearchTerms', JSON.stringify(this.recentSearchTerms));
    }
  }

  performSearch(query: string) {
    console.log(query)
    this.router.navigate(['/results'], { queryParams: { q: query } });
    
  }
}
