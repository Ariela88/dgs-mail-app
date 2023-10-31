import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { Mail } from 'src/app/model/mail';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  searchResults: Mail[] = [];

  constructor(private searchService: SearchService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const searchTerm = params['q'];
      if (searchTerm) {
        this.searchResults = this.searchService.searchMail(searchTerm);
      } else {
        
        console.log('No search term provided');
      }
    });
  }
}
