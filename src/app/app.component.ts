import { Component } from '@angular/core';

import { filter } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  title = 'dgs-mail-app';
  folder: string | undefined
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const childRoute = this.activatedRoute.firstChild;
        if (childRoute) {
          const folderName = childRoute.snapshot.params['folderName'];
          this.folder = folderName;
        }
      });
  }

}
