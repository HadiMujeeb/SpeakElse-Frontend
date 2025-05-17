import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IErrorResponse } from '../../../shared/models/error.model';
import { ILoginSuccessResponse, IUserLoginCredentials } from '../../../shared/models/login-form.model';
import { ImentorauthResponse, IProtectedDataResponse } from '../../../shared/models/protected-data-response.model';
import { MENTOR_API } from '../../../../routes/routesFile';

@Injectable({ providedIn: 'root' })
export class MentorauthService {
  private api: string = MENTOR_API.AUTH;
  constructor(private httpClient: HttpClient) {}

  isMentorExisted$(): Observable<boolean> { 
    const Mentor = localStorage.getItem('mentorToken'); 
    return of( Mentor!== null); 
  }


  requestRegisterApplicationForm(formData: any): Observable<IErrorResponse> {
    return this.httpClient
      .post<IErrorResponse>(`${this.api}/registerApplication`, formData)
      .pipe(
        map((response) => response as IErrorResponse),
        catchError((err) => throwError(err.message ? err.message : err))
      );
  }

  requestMentorLogin(credentials:IUserLoginCredentials): Observable<ILoginSuccessResponse> {
    return this.httpClient.post<ILoginSuccessResponse>(`${this.api}/requestMentorLogin`, credentials).pipe(
      catchError(err => throwError(() => new Error(err.error?.message || "UNKNOWN ERROR")))
    );
  }

  requestMentorLogout(): Observable<any> {
    return this.httpClient.get(`${this.api}/requestMentorLogout`).pipe(
      catchError(err => throwError(() => new Error(err.error?.message || "UNKNOWN ERROR")))
    );
  }

  verifyMentorAccess(): Observable<ImentorauthResponse> {
    return this.httpClient.get<ImentorauthResponse>(`${this.api}/requestMentorAuthenticate`)
      .pipe(catchError((err) => throwError(() => new Error(err.error?.message || 'Unknown error occurred'))));
  }
}
