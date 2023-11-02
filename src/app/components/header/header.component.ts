import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() searchInputChange: EventEmitter<string> =
    new EventEmitter<string>();
  searchTerm = '';

  constructor(private router: Router) {}
  onSearch() {
    this.searchInputChange.emit(this.searchTerm);
    this.router.navigate(['/results'], { queryParams: { q: this.searchTerm } });
    
  }
}
