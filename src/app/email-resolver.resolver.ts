import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { DataService } from './services/data.service';
import { FolderService } from './services/folder.service';

@Injectable({
  providedIn: 'root'
})
export class EmailResolver implements Resolve<any> {

  constructor(private dataServ: DataService, private folderServ:FolderService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const emailId = route.params['id']; 
    
    return this.folderServ.getMailById(emailId);
  }
}
