import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { FolderService } from './services/folder.service';
import { ContactsService } from './services/contacts.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailResolver implements Resolve<any> {

  constructor(
    private folderServ: FolderService,
    private contactsService: ContactsService
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const emailId = route.params['id'];
    const selectedRecipient = this.contactsService.getSelectedRecipient();
    //console.log('EmailResolver called with emailId:', emailId);
  
    if (emailId) {
      return this.folderServ.getMailById(emailId);
    } else if (selectedRecipient) {
     // console.log('Returning selectedRecipient:', selectedRecipient);
      return { selectedRecipient };
    }
  
   // console.log('Returning default resolved data');
    return of({ resolvedData: { selectedRecipient } });
  }
  
  
}
