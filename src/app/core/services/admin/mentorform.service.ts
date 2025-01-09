import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { IApplication } from '../../../shared/models/mentorform.model';
import { ADMIN_API } from '../../../../routes/routesFile';

@Injectable({
  providedIn: 'root'
})
export class MentorformService {
 private api: string = ADMIN_API.APPLICATION
  constructor( private httpClient: HttpClient) { }

  requestGetMentorForm(): Observable<IApplication[]> {
    return this.httpClient.get<IApplication[]>(`${this.api}/getAllApplications`)
    .pipe(catchError((err) => throwError(() => new Error(err.error?.message || 'Unknown error occurred'))));
  }

  requestApproveApplication(email: string, status: string): Observable<any> {
    return this.httpClient.put(`${this.api}/updateApprovalStatus`, { email,status })
    .pipe(catchError((err) => throwError(() => new Error(err.error?.message || 'Unknown error occurred'))));
  }

  requestVerifyApplication(email: string): Observable<any> {
    return this.httpClient.put(`${this.api}/updateMentorStatus`, { email })
    .pipe(catchError((err) => throwError(() => new Error(err.error?.message || 'Unknown error occurred'))));
  }

  sendApplicationEmail(email: string,status: string): Observable<any> {
    return this.httpClient.put(`${this.api}/sendedApplicationMail`, { email,status })
    .pipe(catchError((err) => throwError(() => new Error(err.error?.message || 'Unknown error occurred'))));
  }
}
