import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { Mail } from 'src/app/model/mail';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  ngOnInit(): void {
    console.log('search results components')
  }
  
}


