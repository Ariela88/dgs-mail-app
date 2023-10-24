import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module/material/material.module';


@Component({
  selector: 'app-folder-list',
  standalone: true,
  imports: [CommonModule,MaterialModule],
  templateUrl: './folder-list.component.html',
  styleUrls: ['./folder-list.component.scss']
})
export class FolderListComponent {
  @Output() folderSelected = new EventEmitter<string>();

  changeFolder(folderName: string) {
  
    this.folderSelected.emit(folderName);
  }
}
