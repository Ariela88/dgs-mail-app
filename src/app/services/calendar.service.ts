import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SearchService } from './search.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private selectedDateSubject = new BehaviorSubject<{ day: number; month: number; year: number } | null>(null);
  selectedDate$: Observable<{ day: number; month: number; year: number } | null> = this.selectedDateSubject.asObservable();
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();


  toggleCalendar() {
    console.log('funzione per aprire il calendario',this.isOpenSubject.value)
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }

 
  setSelectedDate(selectedDate: { day: number; month: number; year: number }): void {
    console.log(selectedDate)
    this.selectedDateSubject.next(selectedDate);
    
  }
}
