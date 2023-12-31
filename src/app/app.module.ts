import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
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
    
  ],
  providers: [ {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}],
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
    
    
    
  ]
})
export class AppModule {}
