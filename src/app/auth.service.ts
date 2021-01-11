import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  private token = localStorage.getItem('token') || ''

  loginServerUrl = 'http://localhost:3000/api'

  constructor(private http: HttpClient, private router: Router) { }

  login(userName, password): Promise<boolean> {
    // write a call to the backend
    // examine the status code
    this.token = ''
    return this.http.post<any>(this.loginServerUrl + '/authenticate',
        { userName, password }, { observe: 'response' }
      ).toPromise()
      .then(res => {
        if (res.status == 200) {
          this.token = res.body.token
          localStorage.setItem("token", this.token)
        }
        console.info('res: ', res)
        return true
      })
      .catch(err => {
        if (err.status == 401) {
          // handle error 401:Unauth
        }
        console.info('err:', err)
        return false
      })
  }

  isLogin() {
    const token = localStorage.getItem('token')
    return !!token ? true : false
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isLogin())
      return true
    return this.router.parseUrl('/error')
  }
}
