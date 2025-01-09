import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    _userActionOccured: Subject<void> = new Subject();
    get userActionOccured(): Observable<void> { return this._userActionOccured.asObservable() };

    notifyUserAction() {
        this._userActionOccured.next();
    }

    loginUser() {
        console.log('user login');
    }

    logOutUser() {
        console.log('user logout');
    }

}