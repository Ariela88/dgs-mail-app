import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { FolderService } from 'src/app/services/folder.service';



@Component({
  selector: 'app-folder-list',
  templateUrl: './folder-list.component.html',
  styleUrls: ['./folder-list.component.scss']
})
export class FolderListComponent{

showFolderTree = false;

constructor(private router: Router) {}

toggleFolderTree() {
  this.showFolderTree = !this.showFolderTree;
   }

changeFolder(folderName: string) {  
  
  this.router.navigate(['/folder', folderName]);
   }
 
contacts() {  
  this.router.navigate(['/contacts']);
    }

}
