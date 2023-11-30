import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Output() headerClick: EventEmitter<void> = new EventEmitter<void>();
  stileComponente?: { colore: string; proprieta: string };

  constructor(private colorService: ColorService) {}

  ngOnInit(): void {
    this.colorService.colore$.subscribe((stile) => {
      this.stileComponente = stile as { colore: string; proprieta: string };
    });
  }

  changeTheme(nuovoColore: string): void {
    this.colorService.impostaColore(nuovoColore, 'background-color');
  }
  
  toggleTheme(): void {
    const coloreAttuale = this.stileComponente?.colore || '#ffffff';
    const nuovoColore = coloreAttuale === '#000000' ? '#7d59bd' : '#000000';
    this.colorService.impostaColore(nuovoColore, 'background-color');
    this.headerClick.emit();
  }
  

  
 
}