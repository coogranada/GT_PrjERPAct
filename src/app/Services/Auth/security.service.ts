import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private router: Router) { }

  GetToken() {
    return sessionStorage.getItem('token');
  }

  GetRefreshToken() {
    return sessionStorage.getItem('refreshToken');
  }

  GoLogin() {
    this.router.navigateByUrl('/Login');
    return null;
  }
}