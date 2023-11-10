import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { Router } from '@angular/router';
import { FolderViewerComponent } from '../folder-viewer/folder-viewer.component';

@Component({
  selector: 'app-folder-list',
  templateUrl: './folder-list.component.html',
  styleUrls: ['./folder-list.component.scss']
})
export class FolderListComponent{

  showFolderTree = false;

  toggleFolderTree() {
    this.showFolderTree = !this.showFolderTree;
  }

  constructor(private router: Router) {}

  changeFolder(folderName: string) {  
    this.router.navigate(['/folder', folderName]);
  }
 
  contacts() {  
    this.router.navigate(['/contacts']);
  }

  
}
