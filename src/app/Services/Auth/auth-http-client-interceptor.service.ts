import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { SecurityService } from './security.service';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpClientInterceptorService implements HttpInterceptor{

  constructor(private Security : SecurityService, private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let jwt: string | null = this.Security.GetToken();
    let authRequest : any = null; 
    if (jwt != "" && jwt != null )
        authRequest = req.clone({
          setHeaders : { Authorization : "Bearer " + jwt}
        });
    else 
        authRequest = req.clone({});
    console.log("httpClient",req)
    return next.handle(authRequest).pipe(
      
      catchError((err: any) => {
        console.log("eerrr", err)
        if (err.status == 401) {
          localStorage.clear();
          //window.location.reload();
          return EMPTY;
        } 
        return throwError(() => new Error('Error en la solicitud HTTP'));
      } )   
    )
  }
}
