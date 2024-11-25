import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { IUserRegisterationCredentials, IRegisterSuccessfullResponse } from '../../../shared/models/register-form.model';
import { ILoginSuccessResponse, IUserLoginCredentials } from '../../../shared/models/login-form.model';
import { VerifyOtpReponse, VerifyOtpRequest } from '../../../shared/models/otp-request.model';
import { IProtectedDataResponse } from '../../../shared/models/protected-data-response.model';
import { IUserProfile } from '../../../shared/models/user-profile.model';

@Injectable({ providedIn: 'root' })
export class AuthUserService {
  public userDataSubject = new BehaviorSubject<any>(null);
  public isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private api: string = `${environment.BACKEND_DOMAIN}/api/user/auth`;

  constructor(public httpClient: HttpClient) {}

  RegisterationRequest(registerCredentails: IUserRegisterationCredentials): Observable<IRegisterSuccessfullResponse> {
    return this.httpClient.post<IRegisterSuccessfullResponse>(`${this.api}/registerUser`, registerCredentails)
      .pipe(catchError((err) => throwError(() => new Error(err.error?.message))));
  }

  VerifyOtp(credentials: VerifyOtpRequest): Observable<VerifyOtpReponse> {
    return this.httpClient.post<VerifyOtpReponse>(`${this.api}/verifyOtp`, credentials)
      .pipe(catchError((err) => { console.error('Error occurred while verifying OTP:', err.error?.message); return throwError(() => err); }));
  }

  resentOtp(email: string | null): Observable<VerifyOtpReponse> {
    return this.httpClient.post<VerifyOtpReponse>(`${this.api}/resend-OTP`, { email })
      .pipe(catchError((err) => throwError(() => new Error(err.error || 'Server Error'))));
  }

  loginRequest(loginCredentials: IUserLoginCredentials): Observable<ILoginSuccessResponse> {
    return this.httpClient.post<ILoginSuccessResponse>(`${this.api}/loginUser`, loginCredentials)
      .pipe(catchError((err) => throwError(() => new Error(err.error?.message || 'Login Failed'))));
  }

  getProtectedData(accessToken: string | null): Observable<IProtectedDataResponse> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    return this.httpClient.get<IProtectedDataResponse>(`${this.api}/verify-Token`, { headers })
      .pipe(catchError((err) => throwError(() => new Error(err.error?.message || 'Unknown error occurred'))));
  }

  isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  setLoggedInStatus(status: boolean): void {
    this.isLoggedInSubject.next(status);
  }

  isUserExisted$(): Observable<boolean> {
    return of(localStorage.getItem('userData') !== null);
  }

  logoutRequest(): Observable<any> {
    return this.httpClient.get(`${this.api}/logout`)
      .pipe(catchError((err) => throwError(() => new Error(err.error?.message || 'Logout Failed'))));
  }

  setUserData(user: any): void {
    this.userDataSubject.next(user);
  }

  getUserData(): Observable<any> {
    return this.userDataSubject.asObservable();
  }

  editUserProfile(profileData: IUserProfile): Observable<any> {
    return this.httpClient.put(`${this.api}/profile`, profileData)
      .pipe(catchError((err) => throwError(() => new Error(err.error?.message || 'Failed to update profile'))));
  }

  sendResetPasswordEmail(email: string): Observable<any> {
    console.log('Sending reset password email to:', email);
    return this.httpClient.post(`${this.api}/sendEmailReset`, { email })
      .pipe(catchError((err) => throwError(() => new Error(err.error?.message))));
  }

  requestResetPassword(token: string, password: string): Observable<any> {
    return this.httpClient.post(`${this.api}/resetPassword`, { token, password })
      .pipe(catchError((err) => throwError(() => new Error(err.error?.message))));
  }
}
