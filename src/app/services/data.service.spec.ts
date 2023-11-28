import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { DataService } from './data.service';
import { Mail } from '../model/mail';

describe('DataService', () => {
  let service: DataService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService, MatSnackBar],
    });

    service = TestBed.inject(DataService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get mail messages', () => {
    const mockMail: Mail[] = [
     
    ];

    service.getMailMessage().subscribe((mails) => {
      expect(mails).toEqual(mockMail);
    });

    const req = httpTestingController.expectOne(service.mockMail);
    expect(req.request.method).toEqual('GET');
    req.flush(mockMail);
    httpTestingController.verify();
  });

  it('should post mail message', fakeAsync(() => {
    const mockMail: Mail = {
        id: '0',
        from: 'manuela@gmail.com',
        to: '',
        recipientName: '',
        subject: '',
        body:'',
        sent: true,
        important: false,
        isFavorite: false,
        completed: false,
        selected: false,
        folderName: 'sent',        
        read: true,
        created: new Date(),
        selectable: true,
      
    };

    let response: Mail | undefined;
    service.postMailMessage(mockMail).subscribe((mail) => {
      response = mail;
    });

    const req = httpTestingController.expectOne(service.mockMail);
    expect(req.request.method).toEqual('POST');
    req.flush(mockMail);

    
    tick(2000);

    expect(response).toEqual(mockMail);
    httpTestingController.verify();
  }));

  it('should handle error during post mail message', fakeAsync(() => {
    const mockMail: Mail = {
        id: '0',
        from: 'manuela@gmail.com',
        to: '',
        recipientName: '',
        subject: '',
        body:'',
        sent: true,
        important: false,
        isFavorite: false,
        completed: false,
        selected: false,
        folderName: 'sent',        
        read: true,
        created: new Date(),
        selectable: true,
        
     
    };

    spyOn(service.snackBar, 'open');

    service.postMailMessage(mockMail).subscribe(
      () => {},
      (error) => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpTestingController.expectOne(service.mockMail);
    expect(req.request.method).toEqual('POST');
    req.error(new ErrorEvent('network error'));

    // Advance the clock to simulate the delay
    tick(2000);

    expect(service.snackBar.open).toHaveBeenCalledWith(
      "Errore durante l'invio dell'email",
      'Chiudi',
      jasmine.any(Object)
    );

    httpTestingController.verify();
  }));

  // Add more test cases for other methods as needed

  afterEach(() => {
    httpTestingController.verify();
  });
});
