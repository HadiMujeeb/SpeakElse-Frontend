import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { IUserRegisterationCredentials, IRegisterSuccessfullResponse } from '../../../models/auth/RegistrationForm.interface';
import { ILoginSuccessResponse, IUserLoginCredentials } from '../../../models/auth/LoginForm.interface';
import { VerifyOtpReponse, VerifyOtpRequest } from '../../../models/auth/OTPRequest.interface';
import { IProtectedDataResponse } from '../../../models/auth/ProtectedDataResponse.interface';
import {IUserProfile} from '../../../models/auth/UserProfile.interface';
import { authTokenService } from './auth-token.service';
@Injectable({
  providedIn: 'root'
})
export class AuthUserService {
 

 public userDataSubject = new BehaviorSubject<any>(null);

 public isLoggedInSubject = new BehaviorSubject<boolean>(false);

 private api: string = `${environment.BACKEND_DOMAIN}/api/user/auth`;


  constructor(public httpClient: HttpClient) { }


  RegisterationRequest(registerCredentails: IUserRegisterationCredentials): Observable<IRegisterSuccessfullResponse> {
    const url: string = `${this.api}/registerUser`;
    
    const registerAPIResponse$: Observable<IRegisterSuccessfullResponse> = this.httpClient.post<IRegisterSuccessfullResponse>(url, registerCredentails)
      .pipe(
        catchError((err: any) => {
          return throwError(() => new Error(err.error?.message));
        })
      );

    return registerAPIResponse$;
  }


  VerifyOtp(credentials: VerifyOtpRequest): Observable<VerifyOtpReponse> {
    const url: string = `${this.api}/verifyOtp`;
  
    return this.httpClient.post<VerifyOtpReponse>(url, credentials).pipe(
      catchError((err: any) => {
        return throwError(() => new Error(err.error || "Server Error"));
      })
    );
  }

  loginRequest(loginCredentials: IUserLoginCredentials): Observable<ILoginSuccessResponse> {
    const url: string = `${this.api}/loginUser`;

    return this.httpClient.post<ILoginSuccessResponse>(url, loginCredentials,{withCredentials:true}).pipe(
      catchError((err: any) => {
        return throwError(() => new Error(err.error?.message || "Login Failed"));
      }),
    );
  }

  getProtectedData(): Observable<IProtectedDataResponse> {
    const url: string = `${this.api}/verify-Token`;
  
    return this.httpClient.get<IProtectedDataResponse>(url).pipe(
      catchError((err: any) => {
        const errorMessage = err.error?.message || 'Unknown error occurred';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // New method to get login status
  isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }
  isUserExisted$(): Observable<boolean> {
    const user = localStorage.getItem('userData'); // Adjust as needed
    return of(user !== null); // Return as Observable
  }
  logoutRequest(): Observable<any> {
    const url: string = `${this.api}/logout`;

    return this.httpClient.get(url).pipe(
      tap(() => {
      }),
      catchError((err: any) => {
        return throwError(() => new Error(err.error?.message || 'Logout Failed'));
      })
    );
  }

  setUserData(user: any) {
    this.userDataSubject.next(user); 
  }

  getUserData(): Observable<any> {
    return this.userDataSubject.asObservable(); 
  }

  
  editUserProfile(profileData:IUserProfile ): Observable<any> {
    const url: string = `${this.api}/profile`;

    return this.httpClient.put(url, profileData).pipe(
      catchError((err: any) => {
        return throwError(() => new Error(err.error?.message || 'Failed to update profile'));
      }),
      tap((response) => {
      
        // this.setUserData(response.user);
      })
    );
  }


  sendResetPasswordEmail(email: string): Observable<any> {
    const url: string = `${this.api}/sendEmailReset`;
    console.log("Sending reset password email to:", email); // Add this line
    return this.httpClient.post(url, { email }).pipe(
      catchError((err: any) => {
        console.error("Error sending email:", err); // Log the error
        return throwError(() => new Error(err.error?.message));
      })
    );
  }
  requestResetPassword(token:string,password:string):Observable<any>{
    const url:string = `${this.api}/resetPassword`;
    return this.httpClient.post(url, { token,password }).pipe(
      catchError((err: any) => {
        console.error("Error sending password:", err); // Log the error
        return throwError(() => new Error(err.error?.message));
      })
    );
  }
  }
  
  
