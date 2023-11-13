import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SearchService } from './search.service';
import { HttpClientModule } from '@angular/common/http';
import { Mail } from '../model/mail';
import { DataService } from './data.service';
import { FolderService } from './folder.service';
import { ContactsService } from './contacts.service';

describe('SearchService', () => {
  let service: SearchService;
  let dataService: DataService;
  let folderService: FolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule],
      providers: [SearchService, DataService, FolderService, ContactsService],
    });

    service = TestBed.inject(SearchService);
    dataService = TestBed.inject(DataService);
    folderService = TestBed.inject(FolderService);
  });

  xit('should search for mail and update search results', fakeAsync(() => {
    const testEmails: Mail[] = [
      { id: '1', subject: 'Test Email', to: 'recipient@example.com', from: 'sender@example.com', body: 'This is the body of the email', sent: false, isFavourite: false, selected: false, completed: false, important: false, folderName: 'inbox', read: false },
      { id: '2', subject: 'Test Email', to: 'recipient2@example.com', from: 'sender@example.com', body: 'This is the body of the email', sent: false, isFavourite: false, selected: false, completed: false, important: false, folderName: 'inbox', read: false },
    ];
  
    spyOn(dataService, 'getMailMessage').and.returnValue({
      subscribe: (callback: (emails: Mail[]) => void) => {
        callback(testEmails);
      }
    } as any);
    
    service.searchMail('Test Email');
  
    console.log('Before tick');
    tick();
    console.log('After tick');
    
  
    
    service.searchResults$.subscribe((searchResults) => {
      expect(searchResults).toEqual(testEmails);
     
    });
    
  }));
  
});
