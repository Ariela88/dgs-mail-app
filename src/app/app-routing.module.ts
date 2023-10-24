import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { ComposeComponent } from './components/compose/compose.component';
import { MessageViewerComponent } from './components/message-viewer/message-viewer.component';

const routes: Routes = [
{path: 'home', component: MainComponent},
{path: 'list', component: MessageListComponent},
{path: 'editor', component: ComposeComponent},
{path: '', redirectTo: 'home',pathMatch:'full'},
{ path: 'message/:id', component: MessageViewerComponent },
{path: '**', redirectTo: 'home',pathMatch:'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
