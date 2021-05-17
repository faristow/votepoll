import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.gaurd';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { VotepollComponent } from './poll/votepoll/votepoll.component';
import { VoteCreateComponent } from './vote/vote-create/vote-create.component';
import { VoteComponent } from './vote/vote/vote.component';

const routes: Routes = [
  { path: 'vote', component: VoteComponent },
  { path: '', component:LoginComponent},
  { path: 'register', component:RegisterComponent},
  { path: 'create', component: VoteCreateComponent, canActivate:[AuthGuard]},
  { path: 'edit/:voteId', component: VoteCreateComponent, canActivate:[AuthGuard]},
  { path: 'votepoll', component: VotepollComponent, canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
