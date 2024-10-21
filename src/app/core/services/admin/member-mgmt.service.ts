import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IMember, IMembersListResponse } from '../../../models/admin/member.interface';
import { HttpClient } from '@angular/common/http';
import { IErrorResponse } from '../../../models/Error.interface';


@Injectable({
  providedIn: 'root'
})
export class MemberMgmtService {

  constructor(private httpClient: HttpClient) { }
  private api: string = `${environment.BACKEND_DOMAIN}/api/admin`

  requestRetrieveMembersList():Observable<IMembersListResponse>{
    const url:string =`${this.api}/RetrieveAllMembers`;

    const membersListAPIResponse$:Observable<IMembersListResponse> = this.httpClient.get<IMembersListResponse>(url)
    .pipe(
      map((reponse:IMembersListResponse) => reponse as IMembersListResponse),
      catchError((err:IErrorResponse)=>{
        if (err) {
          return throwError(err as IErrorResponse);
        } else {
          return throwError(err);
        }
      })
    )

    return membersListAPIResponse$;
  }
  requestUpdateUserStatus(memberId: string): Observable<IErrorResponse> {
    const url: string = `${this.api}/updateUserStatus`;
  
    return this.httpClient.put<IErrorResponse>(url, { memberId })
      .pipe(
        map((response: IErrorResponse) => response as IErrorResponse),
        catchError((err: IErrorResponse) => {
          return throwError(err.message ? err.message : err);
        })
      );
  }

  requestEditMemberData( updatedData:IMember,file:File|null): Observable<IErrorResponse> {
    const url: string = `${this.api}/editMemberData`;
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
    return this.httpClient.put<IErrorResponse>(url, formData)
      .pipe(
        map((response: IErrorResponse) => response as IErrorResponse),
        catchError((err: IErrorResponse) => {
          return throwError(err.message ? err.message : err);
        })
      );
  }

  requestAddMemberData(newMember: IMember,file:File|null): Observable<IErrorResponse> {
    const url: string = `${this.api}/addMember`;
    const formData :FormData = new FormData();
    for (const key in newMember) {
      if (newMember.hasOwnProperty(key) && newMember[key as keyof IMember] !== undefined) {
        const value = newMember[key as keyof IMember];
        formData.append(key, String(value));
      }
    }
    if (file) {
      formData.append('image', file, file.name);
    }

  console.log(formData,"daaa")
    return this.httpClient.post<IErrorResponse>(url, formData)
      .pipe(
        map((response: IErrorResponse) => response as IErrorResponse),
        catchError((err: IErrorResponse) => {
          return throwError(err.message ? err.message : err);
        })
      );
  }
  
  
}
