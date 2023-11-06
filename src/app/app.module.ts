import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from './components/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MessageViewerComponent } from './components/message-viewer/message-viewer.component';
import { MainComponent } from "./components/main/main.component";
import { FolderListComponent } from "./components/folder-list/folder-list.component";
import { MaterialModule } from './material-module/material/material.module';
import { ComposeComponent } from "./components/compose/compose.component";
import { ContactsComponent } from "./components/contacts/contacts.component";
import { FolderViewerComponent } from "./components/folder-viewer/folder-viewer.component";





@NgModule({
    declarations: [
        AppComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HeaderComponent,
        HttpClientModule,
        MessageViewerComponent,
        MainComponent,
        FolderListComponent,
        MaterialModule,
        ComposeComponent,
        ContactsComponent,
        FolderViewerComponent
    ]
})
export class AppModule { }
