import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, filter, finalize, map, Observable, switchMap, take, throwError } from 'rxjs';
import { SecurityService } from './security.service';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EncryptionService } from '../Encryption/encryption.service';
import { LoginService } from '../Login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpClientInterceptorService implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private Security: SecurityService, private router: Router, private encryption: EncryptionService, private loginService: LoginService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let jwt: string | null = this.Security.GetToken();
    let authRequest: HttpRequest<any>;
    if (req.url.includes('losolivosmedellin.co'))
      return next.handle(req);
    else if (jwt != "" && jwt != null) {

      if (jwt && !req.url.toLowerCase().includes('refreshtoken')) {
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
        if (err.status == 401) {
          const esRefresh = req.url.toLowerCase().includes('refreshtoken');

          // Si el propio endpoint de refresh devolvió 401
          // significa que la sesión terminó definitivamente
          if (esRefresh) {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(null);
            this.Security.GoLogin();

            Swal.fire({
              title: 'Advertencia',
              text: '',
              html: 'Su sesión ha caducado.',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Aceptar',
              confirmButtonColor: 'rgb(13,165,80)',
              allowOutsideClick: false,
              allowEscapeKey: false,
            });

            return throwError(() => err);
          }

          // Si otra petición ya está renovando el token,
          // esperamos a que termine y reutilizamos el nuevo token
          if (this.isRefreshing) {
            return this.refreshTokenSubject.pipe(
              filter(token => token !== null),
              take(1),
              switchMap(token => {
                const retryRequest = req.clone({
                  setHeaders: { Authorization: `Bearer ${token}` }
                });
                return next.handle(retryRequest);
              })
            );
          }

          const refreshToken = this.Security.GetRefreshToken();
          if (!refreshToken) {
            this.Security.GoLogin();
            return throwError(() => err);
          }

          this.isRefreshing = true;
          // Indicamos que el refresh comenzó
          this.refreshTokenSubject.next(null);

          return this.loginService
            .RefreshToken(refreshToken)
            .pipe(
              switchMap(response => {
                localStorage.setItem('token', response.token);

                // Despierta las peticiones que estaban esperando
                this.refreshTokenSubject.next(response.token);

                const retryRequest = req.clone({
                  setHeaders: { Authorization: `Bearer ${response.token}` }
                });

                return next.handle(retryRequest);
              }),

              catchError(refreshError => {
                this.refreshTokenSubject.next(null);
                this.Security.GoLogin();
                return throwError(() => refreshError);
              }),

              finalize(() => {
                this.isRefreshing = false;
              })
            );
        }


        if (skipError) {
          return throwError(() => err.error);
        }
        if (rawError) {
          return throwError(() => err);
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
