import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageSecurity } from '../../utils/storage-security.util';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private router: Router) { }

  GetToken() {
    return StorageSecurity.getItem('token');
  }

  GetRefreshToken() {
    return StorageSecurity.getItem('refreshToken');
  }

  GoLogin() {
    StorageSecurity.removeItem('token');
    StorageSecurity.removeItem('refreshToken');
    localStorage.setItem('logout-event', Date.now().toString());

    this.router.navigateByUrl('/Login');
  }
}