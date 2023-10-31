import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { Mail } from './model/mail';
import { FolderService } from './services/folder.service';
import { DataService } from './services/data.service';

@Injectable({
  providedIn: 'root'
})
export class ResolverResolver implements Resolve<Mail[]> {
  constructor(private folderService: FolderService, private dataserv:DataService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Mail[]> {
    return this.dataserv.getMailMessage().pipe(
      catchError(error => {
        console.error('Errore nel recupero dei dati delle email:', error);
        return of([]);
      })
    );
  }
}
