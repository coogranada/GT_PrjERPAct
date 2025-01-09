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
  GoLogin() {
    this.router.navigateByUrl('/Login');
    return null;
  }
}
