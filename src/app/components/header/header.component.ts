import { Component, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,MaterialModule,FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  folderSelected = ''
  searchTerm = ''

  constructor(private router: Router, private searchService: SearchService) {}


  onSearch(): void {
    if (this.searchTerm) {
      console.log('Search Term:', this.searchTerm);
      this.router.navigate(['/search'], { queryParams: { q: this.searchTerm } });
    } else {
      console.log('Search Term is empty');
    }
  }
  
  

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      this.onSearch();
    }
  }

}
