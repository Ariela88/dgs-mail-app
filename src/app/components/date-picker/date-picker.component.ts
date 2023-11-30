import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NoteDialogComponent } from '../note-dialog/note-dialog.component';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent implements ControlValueAccessor,OnInit {
  @Input() dateSelected = new Date();

  currentMonth: number;
  calendarIsOpen = false;
  currentYear: number;
  dateSelect = new Date();
  private _onChange: any;
  @Input() disableDatesBeforeToday = false;
  @Input() disableDatesAfterToday = false;
  private _onTouch = () => {};
  private _isDisabled?: boolean;
  @Input() agenda = false;
  defaultColor?: string;
  stileComponente?: { colore: string; proprieta: string };
  coloreCorrente: { colore: string; proprieta: string } = { colore: '', proprieta: '' };
  
  

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
  weeks: { day: number; month: number; year: number; note?: string }[][] = [];

  constructor(private dialog: MatDialog, private colorService:ColorService) {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateCalendar();
  }

  ngOnInit(): void {
    this.colorService.colore$.subscribe((stile) => {
      this.stileComponente = stile as { colore: string; proprieta: string };
    });
  }
  

  generateCalendar() {
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

  isDateSelected(day: { day: number; month: number; year: number }): boolean {
    const selectedDate = this.dateSelected;
    return (
      selectedDate &&
      selectedDate.getDate() === day.day &&
      selectedDate.getMonth() === day.month &&
      selectedDate.getFullYear() === day.year
    );
  }

  isDateSelectable(day: { day: number; month: number; year: number }): boolean {
    if (this.disableDatesBeforeToday) {
      const today = new Date();
      const currentDate = new Date(day.year, day.month, day.day);
      return currentDate > today;
    } else if (this.disableDatesAfterToday) {
      const today = new Date();
      const currentDate = new Date(day.year, day.month, day.day);
      return currentDate < today;
    }
    return true;
  }

  selectDate(day: { day: number; month: number; year: number; note?: string }) {
    const { day: selectedDay, month, year } = day;
    this.dateSelected = new Date(year, month, selectedDay);

    const dialogRef = this.dialog.open(NoteDialogComponent, {
      width: '250px',
      data: { note: day.note || '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Update the note in the selected day
        day.note = result.note;
      }
      this._onChange(this.dateSelected);
      this.closeCalendar();
    });
  }

  writeValue(obj: any): void {
    this.dateSelect = obj;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
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

  openCalendar() {
    this.calendarIsOpen = true;
  }

  closeCalendar() {
    this.calendarIsOpen = false;
  }
}
