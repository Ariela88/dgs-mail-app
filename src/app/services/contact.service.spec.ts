import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';  
import { ContactsService } from './contacts.service'; 
import { HttpClientModule } from '@angular/common/http';


describe('ContactsService', () => {
  let service: ContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers:[ContactsService],
      imports: [HttpClientTestingModule,HttpClientModule],  
    });
    service = TestBed.inject(ContactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
