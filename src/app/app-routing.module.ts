import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { PageNotFoundPageComponent } from './page-not-found-page/page-not-found-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { TwitPostsPageComponent } from './twit-posts-page/twit-posts-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingPageComponent},
	{ path: 'login', component: LoginPageComponent },
	{ path: 'sign-up', component: SignUpPageComponent },
  { path: 'twit-posts/:userId', component: TwitPostsPageComponent },
  { path: 'admin/:userId', component: AdminPageComponent },
  { path: 'page-not-found', component: PageNotFoundPageComponent },
	{ path: '**', redirectTo: '/page-not-found', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
  LandingPageComponent, 
  LoginPageComponent, 
  SignUpPageComponent, 
  TwitPostsPageComponent, 
  AdminPageComponent, 
  PageNotFoundPageComponent
]
