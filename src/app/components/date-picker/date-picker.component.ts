import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CalendarService } from 'src/app/services/calendar.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
})
export class DatePickerComponent {

  @Input() dateSelected: any;
  
  
  currentMonth: number;
  calendarIsOpen = true
  currentYear: number;
  dayNames: string[] = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
  monthNames: string[] = [
    'Gennaio',
    'Febbraio',
    'Marzo',
    'Aprile',
    'Maggio',
    'Giugno',
    'Luglio',
    'Agosto',
    'Settembre',
    'Ottobre',
    'Novembre',
    'Dicembre',
  ];
  weeks: { day: number; month: number; year: number }[][] = [];
  

  constructor(private dialog:MatDialog,private calendarService: CalendarService, private searchService:SearchService,private router:Router) {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateCalendar();

    this.calendarService.isOpen$.subscribe((isOpen) => {
      console.log('calendario aperto')
      this.calendarIsOpen = isOpen;
    });

    const initialDate = {
      day: today.getDate(),
      month: today.getMonth(),
      year: today.getFullYear(),
    };

    this.searchService.initialize(initialDate);

   
  }

  generateCalendar() {
    console.log('Generate Calendar executed');
    this.weeks = [];
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();

    let currentWeek: { day: number; month: number; year: number }[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({ day: 0, month: 0, year: 0 });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      currentWeek.push({
        day,
        month: this.currentMonth,
        year: this.currentYear,
      });

      if (currentWeek.length === 7) {
        this.weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      for (let i = currentWeek.length; i < 7; i++) {
        currentWeek.push({ day: 0, month: 0, year: 0 });
      }
      this.weeks.push(currentWeek);
    }
  }

  selectDate(day: { day: number; month: number; year: number }) {
    console.log(day,'data picker')
    this.calendarService.setSelectedDate(day)
    this.searchService.initialize(day);
    this.router.navigate(['folder/results'])
   
    
  }

  prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }


  closeCalendar() {
    this.calendarService.toggleCalendar();
  }


}
