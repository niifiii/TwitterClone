import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {
  
  //For prevenint Logged in users from viewing Pages

  constructor(private _auth: AuthService){ }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this._auth.isLogin()) {
        return false;//it falses window.alert('You don\'t have permission to view this page');
      }
      
      return true;
  }


  
}
