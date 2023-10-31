import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { ComposeComponent } from './components/compose/compose.component';
import { MessageViewerComponent } from './components/message-viewer/message-viewer.component';

import { ResolverResolver } from './resolver.resolver';
import { FolderViewerComponent } from './components/folder-viewer/folder-viewer.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { SearchResolver } from './search.resolver';

const routes: Routes = [
  { path: 'home', component: MainComponent },
  {
    path: 'folders/:folderName',
    component: FolderViewerComponent,
    resolve: { emails: ResolverResolver },
  },
  { path: 'list', component: MessageListComponent },
  {
    path: 'search',
    component: SearchResultsComponent,
    resolve: {
      searchResults: SearchResolver,
    },
  },
  { path: 'editor', component: ComposeComponent },
  {
    path: 'folder/:folderName/mail/:id',
    component: MessageViewerComponent,
  },
  
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'message/:id', component: MessageViewerComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
