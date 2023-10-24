import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-folder-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './folder-list.component.html',
  styleUrls: ['./folder-list.component.scss']
})
export class FolderListComponent {
  @Output() folderSelected = new EventEmitter<string>();

  changeFolder(folderName: string) {
    console.log(folderName)
    this.folderSelected.emit(folderName);
  }
}
