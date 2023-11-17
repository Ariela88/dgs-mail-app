import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-interceptor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interceptor.component.html',
  styleUrl: './interceptor.component.scss'
})
export class InterceptorComponent implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
      data: { message: 'Loading...' },
    });

    return next.handle(request).pipe(
      finalize(() => {
        dialogRef.close();
      })
    );
  }

}
