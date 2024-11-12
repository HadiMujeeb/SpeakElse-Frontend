import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { IUserRegisterationCredentials, IRegisterSuccessfullResponse } from '../../../shared/models/registerForm.model';
import { ILoginSuccessResponse, IUserLoginCredentials } from '../../../shared/models/LoginForm.interface';
import { VerifyOtpReponse, VerifyOtpRequest } from '../../../shared/models/OTPRequest.interface';
import { IProtectedDataResponse } from '../../../shared/models/ProtectedDataResponse.interface';
import { IUserProfile } from '../../../shared/models/UserProfile.interface';

@Injectable({ providedIn: 'root' })
export class AuthUserService {
  public userDataSubject = new BehaviorSubject<any>(null);
  public isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private api: string = `${environment.BACKEND_DOMAIN}/api/user/auth`;

  constructor(public httpClient: HttpClient) {}

  // Registration
  RegisterationRequest(registerCredentails: IUserRegisterationCredentials): Observable<IRegisterSuccessfullResponse> {
    return this.httpClient.post<IRegisterSuccessfullResponse>(`${this.api}/registerUser`, registerCredentails)
      .pipe(catchError(err => throwError(() => new Error(err.error?.message))));
  }

  // OTP Verification
  VerifyOtp(credentials: VerifyOtpRequest): Observable<VerifyOtpReponse> {
    return this.httpClient.post<VerifyOtpReponse>(`${this.api}/verifyOtp`, credentials)
      .pipe(
        catchError((err) => {
          console.error('Error occurred while verifying OTP:', err.error?.message);
          return throwError(() => err); // Pass the entire error object instead of wrapping in a new Error
        })
      );
  }
  

  resentOtp(email: string|null): Observable<VerifyOtpReponse> {
    return this.httpClient.post<VerifyOtpReponse>(`${this.api}/resend-OTP`, { email })
      .pipe(catchError(err => throwError(() => new Error(err.error || 'Server Error'))));
  }

  // Login
  loginRequest(loginCredentials: IUserLoginCredentials): Observable<ILoginSuccessResponse> {
    return this.httpClient.post<ILoginSuccessResponse>(`${this.api}/loginUser`, loginCredentials)
      .pipe(catchError(err => throwError(() => new Error(err.error?.message || 'Login Failed'))));
  }

  // Protected Data
  getProtectedData(accessToken:string|null): Observable<IProtectedDataResponse> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    return this.httpClient.get<IProtectedDataResponse>(`${this.api}/verify-Token`,{ headers })
      .pipe(catchError(err => throwError(() => new Error(err.error?.message || 'Unknown error occurred'))));
  }

  // User Status
  isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  isUserExisted$(): Observable<boolean> {
    return of(localStorage.getItem('userData') !== null); // Adjust as needed
  }

  // Logout
  logoutRequest(): Observable<any> {
    return this.httpClient.get(`${this.api}/logout`)
      .pipe(catchError(err => throwError(() => new Error(err.error?.message || 'Logout Failed'))));
  }

  setUserData(user: any) {
    this.userDataSubject.next(user);
  }

  getUserData(): Observable<any> {
    return this.userDataSubject.asObservable();
  }

  // Edit Profile
  editUserProfile(profileData: IUserProfile): Observable<any> {
    return this.httpClient.put(`${this.api}/profile`, profileData)
      .pipe(catchError(err => throwError(() => new Error(err.error?.message || 'Failed to update profile'))), tap(response => {
        // Uncomment if needed: this.setUserData(response.user);
      }));
  }

  // Password Reset
  sendResetPasswordEmail(email: string): Observable<any> {
    console.log('Sending reset password email to:', email); // Log email sending
    return this.httpClient.post(`${this.api}/sendEmailReset`, { email })
      .pipe(catchError(err => throwError(() => new Error(err.error?.message))));
  }

  requestResetPassword(token: string, password: string): Observable<any> {
    return this.httpClient.post(`${this.api}/resetPassword`, { token, password })
      .pipe(catchError(err => throwError(() => new Error(err.error?.message))));
  }
}
