import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, map, Observable, throwError } from 'rxjs';
import { SecurityService } from './security.service';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EncryptionService } from '../Encryption/encryption.service';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpClientInterceptorService implements HttpInterceptor {

  constructor(private Security: SecurityService, private router: Router, private encryption: EncryptionService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let jwt: string | null = this.Security.GetToken();
    let authRequest: HttpRequest<any>;
    if (req.url.includes('losolivosmedellin.co'))
      return next.handle(req);
    else if (jwt != "" && jwt != null) {
      try {
        const payload = JSON.parse(atob(jwt.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem('token');
          jwt = null;
        }
      } catch (e) {
        localStorage.removeItem('token');
        jwt = null;
      }

      if (jwt) {
        authRequest = req.clone({
          setHeaders: { Authorization: "Bearer " + jwt }
        });
      } else {
        authRequest = req.clone({});
      }
    }
    else
      authRequest = req.clone({});

    const skipError = req.url.includes('skipErrorHandling=true');
    const rawError = req.url.includes('rawError=true');
    return next.handle(authRequest).pipe(

      map(event => {
        if (!(event instanceof HttpResponse))
          return event;
        if (!event.body)
          return event;
        if (!event.body.payload)
          return event;
        const body = this.encryption.decrypt(event.body.payload);
        return event.clone({
          body
        });
      }),

      catchError((err: any) => {
        if (skipError) {
          return throwError(() => err.error);
        }
        if (rawError) {
          return throwError(() => err);
        }
        if (err.status == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          Swal.fire({
            title: 'Advertencia',
            text: '',
            html: 'Su session ha caducado ',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'rgb(13,165,80)',
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
          this.router.navigate(['/login']);
          return throwError(() => err.error);
        } else if (err.status == 400) {
          if (err.error?.payload) {
            const body = this.encryption.decrypt(err.error.payload);
            return throwError(() => body);
          }          
          return throwError(() => err.error);
        }
        return throwError(() => new Error('Error en la solicitud HTTP', err.error));
      }));
  }
}
