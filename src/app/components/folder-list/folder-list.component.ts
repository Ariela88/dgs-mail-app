import { MediaMatcher } from '@angular/cdk/layout';
import { Component, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-folder-list',
  templateUrl: './folder-list.component.html',
  styleUrls: ['./folder-list.component.scss'],
})
export class FolderListComponent {
  showFolderTree = false;

  @Input() folder: string | undefined;
  folders = [
    { name: 'Tutte le mail', action: () => this.changeFolder('all') },
    { name: 'In Arrivo', action: () => this.changeFolder('inbox') },
    { name: 'Inviate', action: () => this.changeFolder('sent') },
    { name: 'Preferiti', action: () => this.changeFolder('favorite') },
    { name: 'Importanti', action: () => this.changeFolder('important') },
    { name: 'Cestino', action: () => this.changeFolder('trash') },
    { name: 'Bozze', action: () => this.changeFolder('bozze') },
    { name: 'In uscita', action: () => this.changeFolder('outgoing') },
  ];

  @ViewChild('foldersMenuTrigger') foldersMenuTrigger?: MatMenuTrigger;

  showMobileMenu = false;

  constructor(private router: Router) {}

  openFoldersMenu() {
    if (this.foldersMenuTrigger) {
      this.foldersMenuTrigger.openMenu();
    }
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeMobileMenu() {
    this.showMobileMenu = false;
  }

  toggleFolderTree() {
    this.showFolderTree = !this.showFolderTree;
  }

  changeFolder(folderName: string) {
    this.folder = folderName;
    this.router.navigate(['/folder', folderName]);
  }

  navigateToContacts() {
    this.router.navigate(['/contacts']);
  }
  navigateToAgenda() {
    this.router.navigate(['/home']);
  }
}
