import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UsersListComponent } from './users-list/users-list.component';

const routes: Routes = [
  { path: 'users/new', component: UserDetailsComponent },
  { path: 'users/:id', component: UserDetailsComponent },
  { path: '', component: UsersListComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
