import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentDate$: Observable<string> | null = null
folderName?:string
  constructor(private dateService: DataService) {}

  ngOnInit(): void {
    this.currentDate$ = this.dateService.getCurrentDateWithDelay();
   
  }

}