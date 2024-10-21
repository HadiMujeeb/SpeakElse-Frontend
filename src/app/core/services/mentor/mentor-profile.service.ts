import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { HttpClient } from '@angular/common/http';
import { IMember } from '../../../models/admin/member.interface';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IErrorResponse } from '../../../models/Error.interface';

@Injectable({
  providedIn: 'root'
})
export class MentorProfileService {
  private api: string = `${environment.BACKEND_DOMAIN}/api/user`
  constructor(private httpClient:HttpClient) { }

  requestEditMentorData( updatedData:IMember,file: File | null): Observable<IErrorResponse> {
    const url: string = `${this.api}/updateMemberData`;
    const formData :FormData = new FormData();
  
    for (const key in updatedData) {
      if (updatedData.hasOwnProperty(key) && updatedData[key as keyof IMember] !== undefined) {
        const value = updatedData[key as keyof IMember];
        formData.append(key, String(value));
      }
    }
    if (file) {
      formData.append('image', file, file.name);
    }

    return this.httpClient.post<IErrorResponse>(url, formData)
      .pipe(
        map((response: IErrorResponse) => response as IErrorResponse),
        catchError((err: IErrorResponse) => {
          return throwError(err.message ? err.message : err);
        })
      );
  }
}

