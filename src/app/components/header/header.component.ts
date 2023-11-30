import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

 
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
    const coloreAttuale = this.stileComponente?.colore || '#444444';
    const nuovoColore = coloreAttuale === '#444444' ? '#7d59bd' : '#444444';
    this.colorService.impostaColore(nuovoColore, 'background-color');
   
  }
  

  
 
}