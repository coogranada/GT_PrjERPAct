import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private router: Router) { }

  GetToken() {
    return localStorage.getItem('token');
  }

  GetRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  GoLogin() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.setItem('logout-event', Date.now().toString());

    this.router.navigateByUrl('/Login');
  }
}