import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { IResponseReport } from '../../../shared/models/friendsRating.model';
import { ADMIN_API } from '../../../../routes/routesFile';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private api: string = ADMIN_API.REPORTS
  constructor(private httpClient: HttpClient) { }

  requestGetAllReports(): Observable<IResponseReport[]> {
    return this.httpClient.get<IResponseReport[]>(`${this.api}/requestGetAllReports`)
    .pipe(catchError((err) => throwError(() => new Error(err.error?.message || 'Unknown error occurred'))));
  }

  requestUpdateReportStatus(reportId: string, status: string): Observable<any> {
    return this.httpClient.put(`${this.api}/requestUpdateReportStatus`, { reportId, status })
    .pipe(catchError((err) => throwError(() => new Error(err.error?.message || 'Unknown error occurred'))));
  }

  requestBlockUnblockUser(userId: string): Observable<any> {
    return this.httpClient.put(`${this.api}/requestBlockUnblockUser`, {userId })
    .pipe(catchError((err) => throwError(() => new Error(err.error?.message || 'Unknown error occurred'))));
  }

  requestGellAllTransactions(): Observable<any> {
    return this.httpClient.get(`${this.api}/requestGellAllTransactions`)
    .pipe(catchError((err) => throwError(() => new Error(err.error?.message || 'Unknown error occurred'))));
  }
}
