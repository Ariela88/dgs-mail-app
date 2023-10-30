import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FolderService } from './services/folder.service';
import { Mail } from './model/mail';
import { DataService } from './services/data.service';

export const resolverResolver: ResolveFn<Mail> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any =>{


  const folderName = route.params['folderName'] || 'inbox';
  const folderService = new FolderService()

let emails = folderService.getEmails(folderName)
console.log(folderName)

return emails

  }
