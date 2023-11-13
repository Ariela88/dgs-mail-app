import { TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Mail } from '../model/mail';
import { FolderService } from './folder.service';

describe('FolderService', () => {
  let service: FolderService;
  const email: Mail = {
    id: '1',
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
    read: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FolderService],
      imports: [MatDialogModule],
    });
    service = TestBed.inject(FolderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add email to folder', () => {
    const folderName = 'inbox';

    service.addEmailToFolder(email, folderName);

    expect(service.getEmails(folderName)).toContain(email);
    expect(service.getEmails('all')).toContain(email);
  });

  it('should remove email from folder', fakeAsync(() => {
    const testEmail = {  id: '1',
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
      read: false, };
  
    service.emails['inbox'] = [testEmail];
  
    console.log('Before removal:', service.emails['inbox']);
    
    service.removeEmailFromFolder('1', 'inbox');
    tick();
    flushMicrotasks();
    
    console.log('After removal:', service.emails['inbox']);
  
    
    console.log('All emails:', service.emails['all']);
  
    expect(service.emails['inbox']).not.toContain(testEmail);
    

  }));
  

  it('should update email list when folder is changed', () => {
    const folderName = 'inbox';

    spyOn(service.emailsSubject, 'next');

    service.selectFolder(folderName);

    expect(service.emailsSubject.next).toHaveBeenCalledOnceWith(service.getEmails(folderName));
  });

  it('should get mail by ID', () => {
    spyOn(service, 'getMailById').and.returnValue(of(email));

    service.getMailById('1').subscribe((result) => {
      expect(result).toEqual(email);
    });
  });
});
