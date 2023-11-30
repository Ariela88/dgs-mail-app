// color.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private coloreSubject: BehaviorSubject<{ colore: string; proprieta: string }> = new BehaviorSubject({
    colore: '#7e59bda6',
    proprieta: 'background-color',
  });
  colore$: Observable<{ colore: string; proprieta: string }> = this.coloreSubject.asObservable();
  coloreDefault: string = '#7e59bda6';

  constructor() {}

  impostaColore(nuovoColore: string, nuovaProprieta: string): void {
    this.coloreSubject.next({ colore: nuovoColore, proprieta: nuovaProprieta });
  }

  resettaColore(): void {
    this.coloreSubject.next({ colore: this.coloreDefault, proprieta: 'background-color' });
  }
}
