import { Component, OnInit} from '@angular/core';
import { filter } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ColorService } from './services/color.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'dgs-mail-app';
  folder: string | undefined;
  contacts: string | undefined;
  showHomeH2: boolean = true; 
  agenda: boolean = true;
  stileComponente?: { colore: string; proprieta: string };
 
  constructor(private router: Router, private activatedRoute: ActivatedRoute,private colorService: ColorService) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const childRoute = this.activatedRoute.firstChild;
        if (childRoute) {
          const folderName = childRoute.snapshot.params['folderName'];
          this.folder = folderName;
          const contacts = childRoute.snapshot.params['contacts'];
          this.contacts = contacts;         
          this.showHomeH2 = !this.folder && !this.contacts;
          this.agenda = folderName === 'home' && contacts === 'agenda';
        }
      });
  }

  ngOnInit(): void {
    this.colorService.colore$.subscribe((stile) => {
      this.stileComponente = stile as { colore: string; proprieta: string };
    });
  }
  
  onHeaderClick(): void {
    const nuovoColore = this.stileComponente?.colore || '#ffffff';
    this.colorService.impostaColore(nuovoColore, 'background-color');

  }

}
