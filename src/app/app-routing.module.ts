import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//
import { AdminPageComponent } from './admin-page/admin-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { PageNotFoundPageComponent } from './page-not-found-page/page-not-found-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { TwitPostsPageComponent } from './twit-posts-page/twit-posts-page.component';
import { BrowseUsersPageComponent } from './browse-users-page/browse-users-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { PasswordResetPageComponent } from './password-reset-page/password-reset-page.component';
import { RegisteredComponent } from './registered/registered.component';
import { AuthService } from './auth.service';
import { ErrorPageComponent } from './error-page/error-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingPageComponent},
  { path: 'login', component: LoginPageComponent },
  { path: 'password-reset', component: PasswordResetPageComponent },
	{ path: 'sign-up', component: SignUpPageComponent },
  { path: 'twit-posts/:userName', component: TwitPostsPageComponent },
  { 
    path: 'admin', component: AdminPageComponent,
    canActivate: [AuthService]
  },
  { path: 'browse-users', component: BrowseUsersPageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'password-reset', component: PasswordResetPageComponent },
  { path: 'registered', component: RegisteredComponent},
  { path: 'page-not-found', component: PageNotFoundPageComponent },
  { path: 'error', component: ErrorPageComponent },
	{ path: '**', redirectTo: '/page-not-found', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], //, {useHash: true}
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
  LandingPageComponent, 
  LoginPageComponent, 
  SignUpPageComponent, 
  TwitPostsPageComponent, 
  AdminPageComponent, 
  PageNotFoundPageComponent,
  BrowseUsersPageComponent,
  AboutPageComponent,
  PasswordResetPageComponent, 
  RegisteredComponent,
  ErrorPageComponent
]
