import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { IUserRegisterationCredentials, IRegisterSuccessfullResponse } from '../../../models/auth/RegistrationForm.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private api: string = `${environment.BACKEND_DOMAIN}/api/user`;

  constructor(public httpClient: HttpClient) { }

  RegisterationRequest(registerCredentails: IUserRegisterationCredentials): Observable<IRegisterSuccessfullResponse> {
    const url: string = `${this.api}/register`;

    const registerAPIResponse$: Observable<IRegisterSuccessfullResponse> = this.httpClient.post<IRegisterSuccessfullResponse>(url, registerCredentails)
      .pipe(
        catchError((err: any) => {
          return throwError(() => new Error(err.error?.userExists || "Server Error"));
        })
      );

    return registerAPIResponse$;
  }

  
  VerifyOtp(email: string, enterotp: string): Observable<any> {
    const url: string = `${this.api}/verifyOtp`;
    const body = { email, enterotp }; 

    return this.httpClient.post(url, body).pipe(
      catchError((err: any) => {
        return throwError(() => new Error(err.error || "Server Error"));
      })
    );
  }

   // Observable for login status

 isLoggedIn():Observable<boolean>{
  return this.isLoggedInSubject.asObservable();
 }

  // Set login status
  
  setLoginStatus(status:boolean):void {
    this.isLoggedInSubject.next(status);
  }

  login():void {
    this.setLoginStatus(true);
  }

  logout():void {
    this.setLoginStatus(false);
  }

}