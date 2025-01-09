import { Injectable } from '@angular/core';
import { ConnectionBackend, Headers, Http, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch'
import { SecurityService } from './security.service';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthHttpInterceptorService extends Http {

  constructor( backend: ConnectionBackend,defaultOptions : RequestOptions,private Security : SecurityService) {
   super(backend,defaultOptions)
  }
  get(url: string, option?: RequestOptionsArgs): Observable<any> {
    let jwt: string = this.Security.GetToken();
    if (jwt != "" && jwt != null ) {
      if (!option)
        option = { headers: new Headers() };
      
      option.headers.delete("Authorization");
      option.headers.append("Authorization", "Bearer " + jwt);
    }
   return super.get(url,option).catch(this.handleError)
  }
  post(url: string, body: any, option?: RequestOptionsArgs): Observable<any> {
     let jwt: string = this.Security.GetToken();
     if (jwt != "" && jwt != null ) {
       if (!option)
         option = { headers: new Headers() };
       
       option.headers.delete("Authorization");
       option.headers.append("Authorization", "Bearer " + jwt);
     }
    return super.post(url, body, option).catch(this.handleError);
  }
  handleError(handleError: any) : Observable<any>{
    console.log("Error", handleError)
    if (handleError.status == 401) {
      localStorage.clear();
      window.location.reload();
      return;
    }
    return throwError(handleError);
  }
}
