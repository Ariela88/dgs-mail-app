import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,MaterialModule,FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
// searchTerm = ''

// @Output() searchEvent = new EventEmitter<string>();

//   onSearch(event: Event): void {
//   const searchTerm = (event.target as HTMLInputElement).value!;
//   this.searchEvent.emit(searchTerm);
// }


}
