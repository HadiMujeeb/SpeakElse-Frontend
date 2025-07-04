import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { catchError, map, Observable, throwError } from 'rxjs';
import {
  IMember,
  IMemberResponse,
  IMembersListResponse,
} from '../../../shared/models/member.model';
import { HttpClient } from '@angular/common/http';
import { IErrorResponse } from '../../../shared/models/error.model';
import { ADMIN_API } from '../../../../routes/routesFile';

@Injectable({ providedIn: 'root' })
export class MemberMgmtService {
  private api: string = ADMIN_API.BASE;

  constructor(private httpClient: HttpClient) {}

  private appendDataToFormData(data: IMember, file: File | null): FormData {
    const formData: FormData = new FormData();

    for (const key in data) {
      if (
        data.hasOwnProperty(key) &&
        data[key as keyof IMember] !== undefined
      ) {
        formData.append(key, String(data[key as keyof IMember]));
      }
    }

    if (file) {
      formData.append('image', file, file.name);
    }

    return formData;
  }

  requestRetrieveMembersList(): Observable<IMembersListResponse> {
    return this.httpClient
      .get<IMembersListResponse>(`${this.api}/RetrieveAllMembers`)
      .pipe(
        map((response) => response as IMembersListResponse),
        catchError((err) => throwError(err as IErrorResponse))
      );
  }
  

  requestUpdateUserStatus(memberId: string): Observable<IErrorResponse> {
    return this.httpClient
      .put<IErrorResponse>(`${this.api}/updateUserStatus`, { memberId })
      .pipe(
        map((response) => response as IErrorResponse),
        catchError((err) => throwError(err.message ? err.message : err))
      );
  }

  requestEditMemberData(
    updatedData: IMember,
    file: File | null
  ): Observable<IErrorResponse> {
    const formData = this.appendDataToFormData(updatedData, file);

    return this.httpClient
      .put<IErrorResponse>(`${this.api}/editMemberData`, formData)
      .pipe(
        map((response) => response as IErrorResponse),
        catchError((err) => throwError(err.message ? err.message : err))
      );
  }

  requestAddMemberData(
    newMember: IMember,
    file: File | null
  ): Observable<IMemberResponse>{
    const formData = this.appendDataToFormData(newMember, file);

    return this.httpClient
      .post<IMemberResponse>(`${this.api}/addMember`, formData)
      .pipe(
        map((response) => response),
        catchError((err) => throwError(err.message ? err.message : err))
      );
  }
}
