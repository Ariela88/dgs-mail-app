import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { MatDialog } from '@angular/material/dialog';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentDate$: Observable<string> | null = null
folderName?:string
calendarIsOpen = true
@ViewChild(DatePickerComponent) datePickerComponent: DatePickerComponent | undefined;
  constructor(private dateService: DataService,private dialog:MatDialog,private calendarService:CalendarService) {}

  ngOnInit(): void {
    this.currentDate$ = this.dateService.getCurrentDateWithDelay();
   
  }

  toggleCalendar() {
    console.log('header toggle', this.calendarIsOpen)
    this.calendarService.toggleCalendar()
  }

  openDatePicker() {
    console.log('Open date picker');
    const dialogRef = this.dialog.open(DatePickerComponent, {
      width: 'auto',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Date picker closed', result);
      
    });
  }
  

  consoleLogAndOpenDatePicker() {
    console.log('Button clicked', );
    this.openDatePicker();
  }
  
}