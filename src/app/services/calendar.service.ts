import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  toggleCalendar() {
    console.log('funzione per aprire il calendario',this.isOpenSubject.value)
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }
}
