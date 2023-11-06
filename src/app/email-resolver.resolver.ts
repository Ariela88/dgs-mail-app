// email-resolver.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { DataService } from './services/data.service';
import { FolderService } from './services/folder.service';
import { ContactsService } from './services/contacts.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailResolver implements Resolve<any> {

  constructor(
    private dataServ: DataService,
    private folderServ: FolderService,
    private contactsService: ContactsService
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const emailId = route.params['id'];
    const selectedRecipient = this.contactsService.getSelectedRecipient();

    if (emailId) {
      return this.folderServ.getMailById(emailId);
    } else if (selectedRecipient) {
      return { selectedRecipient };
    }

    return of({ resolvedData: { selectedRecipient } });
  }
  
}
