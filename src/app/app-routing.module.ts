import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComposeComponent } from './components/compose/compose.component';
import { MessageViewerComponent } from './components/message-viewer/message-viewer.component';
import { ResolverResolver } from './resolver.resolver';
import { FolderViewerComponent } from './components/folder-viewer/folder-viewer.component';
import { SearchResolver } from './search.resolver';
import { EmailResolver } from './email-resolver.resolver';
import { ContactsComponent } from './components/contacts/contacts.component';

const routes: Routes = [
  { path: '', redirectTo: 'folder/all', pathMatch: 'full' },
  { path: 'folder/:folderName', component: FolderViewerComponent, resolve: { emails: ResolverResolver }},
  { path: 'folder/inbox', component: FolderViewerComponent, resolve: { emails: ResolverResolver }},
  { path: 'editor', component: ComposeComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'folder/:folderName/mail/:id', component: MessageViewerComponent },
  { path: 'results', component: FolderViewerComponent, resolve: { searchResults: SearchResolver } },
  { path: 'editor', component: ComposeComponent, resolve: { emailData: EmailResolver, resolve: ResolverResolver } },

  { path: '**', redirectTo: 'folder/inbox', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
