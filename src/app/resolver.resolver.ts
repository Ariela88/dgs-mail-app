import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Mail } from './model/mail';
import { FolderService } from './services/folder.service';
import { DataService } from './services/data.service';

@Injectable({
  providedIn: 'root'
})
export class ResolverResolver implements Resolve<Mail[]> {
  
  constructor(private folderService: FolderService, private dataserv:DataService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Mail[]> {
    const folderName = route.params['folderName'] || 'inbox';
     return this.folderService.getEmailsObservable(folderName);
      }
}
