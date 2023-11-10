import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule,SearchComponent,RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {


}
