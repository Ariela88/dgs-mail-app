import { Component, EventEmitter, Output } from '@angular/core';
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
export class SearchComponent {
  recentSearchTerms: string[] = [];
  @Output() searchInputChange: EventEmitter<string> = new EventEmitter<string>();
  searchTerm = '';

  constructor(private searchService: SearchService, private router: Router) {}

  onSearchInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    this.searchInputChange.emit(inputValue);

    if (inputValue.trim() !== '') {
      this.searchService.searchMail(inputValue);
    }
  }

  onSearch() {
    this.router.navigate(['/results'], { queryParams: { q: this.searchTerm } });
  }

  getFilteredSuggestions(): string[] {
    const filterValue = this.searchTerm.toLowerCase();
    return this.recentSearchTerms.filter(term => term.toLowerCase().includes(filterValue));
  }

}
