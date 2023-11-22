import { Component, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, retry } from 'rxjs/operators';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-interceptor',
  template: '', 
  styleUrls: ['./interceptor.component.scss'],
})

@Injectable()
export class InterceptorComponent implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
      data: {
        message: request.method === 'DELETE' ? 'Cancellazione email...' : 'Loading...',
      },
    });

    return next.handle(request).pipe(
      retry(2),
      catchError((error: HttpErrorResponse) => {
        alert('Http Error: richiesta negata ');
        return throwError(error);
      }),
      finalize(() => {
        dialogRef.close();
      })
    );
  }
}
