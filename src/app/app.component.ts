import { Component, ElementRef, OnInit } from '@angular/core';
import { ModalService } from './services/modal.service';
import { DataService } from './services/data.service';
import { FolderService } from './services/folder.service';
import { Mail } from './model/mail';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'dgs-mail-app';

  constructor(private modalService: ModalService, private el: ElementRef,private folderService: FolderService,
    private dataServ: DataService) {}
  selectedMails: Mail[] = [];

 

  ngOnInit() {
    const foldername = '';
    this.dataServ.getMailMessage().subscribe(
      (data: Mail[]) => {
        this.selectedMails = [...data];
        this.selectedMails.forEach((email) => {
          this.folderService.addEmailToFolder(email, foldername);
        });
      },
      (error) => {
        console.error('Error fetching mail data: ', error);
      }
    );
  }
  openModal() {
    const data = {
      title: 'Nuova Mail',
    
    };
    this.modalService.openModal(data, this.el);
  }
  searchTerm: string = '';

  handleSearchInputChange(searchTerm: string) {
    
    this.searchTerm = searchTerm;

  }
 
}
