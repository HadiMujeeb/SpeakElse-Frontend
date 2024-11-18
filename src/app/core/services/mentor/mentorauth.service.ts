import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IErrorResponse } from '../../../shared/models/error.model';

@Injectable({ providedIn: 'root' })
export class MentorauthService {
  private api: string = `${environment.BACKEND_DOMAIN}/api/mentor/auth`;
  constructor(private httpClient: HttpClient) {}

  requestRegisterApplicationForm(formData: any): Observable<IErrorResponse> {
    return this.httpClient
      .post<IErrorResponse>(`${this.api}/registerApplication`, formData)
      .pipe(
        map((response) => response as IErrorResponse),
        catchError((err) => throwError(err.message ? err.message : err))
      );
  }
}
