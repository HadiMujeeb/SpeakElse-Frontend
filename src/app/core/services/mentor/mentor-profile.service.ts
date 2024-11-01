import { Injectable } from '@angular/core'; 
import { environment } from '../../../../environment/environment.development'; 
import { HttpClient } from '@angular/common/http'; 
import { IMember } from '../../../shared/models/member.interface'; 
import { catchError, map, Observable, throwError } from 'rxjs'; 
import { IErrorResponse } from '../../../shared/models/Error.interface';

@Injectable({ providedIn: 'root' }) 
export class MentorProfileService { 
  private api: string = `${environment.BACKEND_DOMAIN}/api/mentor`; 
  constructor(private httpClient: HttpClient) {}

  requestEditMentorData(updatedData: IMember, file: File | null): Observable<IErrorResponse> {
    const formData: FormData = new FormData(); 
    for (const key in updatedData) { 
      if (updatedData.hasOwnProperty(key) && updatedData[key as keyof IMember] !== undefined) 
        formData.append(key, String(updatedData[key as keyof IMember])); 
    } 
    if (file) formData.append('image', file, file.name);

    return this.httpClient.put<IErrorResponse>(`${this.api}/updateMentorData`, formData)
      .pipe(map(response => response as IErrorResponse), catchError(err => throwError(err.message ? err.message : err)));
  }
}
