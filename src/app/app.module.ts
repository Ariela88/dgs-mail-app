import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material-module/material/material.module';
import { HeaderComponent } from './components/header/header.component';
import { MessageViewerComponent } from './components/message-viewer/message-viewer.component';
import { FolderListComponent } from './components/folder-list/folder-list.component';
import { ComposeComponent } from './components/compose/compose.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { FolderViewerComponent } from './components/folder-viewer/folder-viewer.component';
import { FormsModule } from '@angular/forms';
import { ContactActionsComponent } from './components/contact-actions/contact-actions.component';
import { MessageActionsComponent } from './components/message-actions/message-actions.component';
import { SearchComponent } from './components/search/search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { TimeStampPipe } from './pipes/time-stamp.pipe';
import { LoadingComponent } from './components/loading/loading.component';
import { NgPipesModule } from 'ngx-pipes';
import { OrderByPipe } from 'ngx-pipes';
import { InterceptorComponent } from './components/interceptor/interceptor.component';
import { DatePickerComponent } from "./components/date-picker/date-picker.component";
import { CalendarService } from './services/calendar.service';



@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        MessageViewerComponent,
        FolderListComponent,
        ComposeComponent,
        ContactsComponent,
        FolderViewerComponent,
        MessageActionsComponent,
        ContactActionsComponent,
        SearchComponent,
        ConfirmationDialogComponent,
        LoadingComponent,
        DatePickerComponent
    ],
    providers: [{ provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }, OrderByPipe, {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorComponent,
            multi: true,
        },
    CalendarService],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        TimeStampPipe,
        NgPipesModule,
        
    ]
})
export class AppModule {}
