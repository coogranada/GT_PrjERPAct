import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { SecurityService } from './security.service';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpClientInterceptorService implements HttpInterceptor {

  constructor(private Security: SecurityService, private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let jwt: string | null = this.Security.GetToken();
    let authRequest: any = null;    
    if (req.url.includes('losolivosmedellin.co'))
      return next.handle(req);    
    else if (jwt != "" && jwt != null)
      authRequest = req.clone({
        setHeaders: { Authorization: "Bearer " + jwt }
      });
    else
      authRequest = req.clone({});
    return next.handle(authRequest).pipe(
      catchError((err: any) => {
        if (err.status == 401) {
          localStorage.clear();
          window.location.reload();
          return throwError(() => err.error);
        }else if(err.status == 400)
          return throwError(() => err.error);
        return throwError(() => new Error('Error en la solicitud HTTP',err.error));
      }));
  }
}
