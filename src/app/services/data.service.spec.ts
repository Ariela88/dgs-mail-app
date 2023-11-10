import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { DataService } from './data.service';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { FolderService } from './folder.service';
import { Mail } from '../model/mail';

describe('DataService', () => {
  let service: DataService;
  let httpTestingController: HttpTestingController;
  let folderService: FolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService, FolderService],
      imports: [MatDialogModule, HttpClientTestingModule, HttpClientModule],
    });
    service = TestBed.inject(DataService);
    httpTestingController = TestBed.inject(HttpTestingController);
    folderService = TestBed.inject(FolderService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch mail messages and update FolderService', fakeAsync(() => {
    const mockEmails: Mail[] = [
      {  id: '1',
      subject: 'Test Email',
      to: 'recipient@example.com',
      from: 'sender@example.com',
      body: 'This is the body of the email',
      sent: false,
      isFavourite: false,
      selected: false,
      completed: false,
      important: false,
      folderName: 'inbox',
      read: false, },
      {  id: '2',
      subject: 'Test Email',
      to: 'recipient2@example.com',
      from: 'sender@example.com',
      body: 'This is the body of the email',
      sent: false,
      isFavourite: false,
      selected: false,
      completed: false,
      important: false,
      folderName: 'inbox',
      read: false,},
    ];

    
    service.getMailMessage().subscribe();

    const req = httpTestingController.expectOne('/assets/mail.json');
    expect(req.request.method).toEqual('GET');

    req.flush(mockEmails);

    tick();

    const inboxEmails = folderService.getEmails('inbox');
    expect(inboxEmails).toEqual(mockEmails);
  }));
});
