import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { HttpClient } from '@angular/common/http';
import { IMember } from '../../../shared/models/member.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IErrorResponse } from '../../../shared/models/error.model';
import { IMentorApplication } from '../../../shared/models/mentor-application.model';
import { IApplication, IMentorRoom } from '../../../shared/models/mentorform.model';
import { IComment } from '../../../shared/models/friendsRating.model';
import { MENTOR_API } from '../../../../routes/routesFile';

@Injectable({ providedIn: 'root' })
export class MentorProfileService {
  private api: string = MENTOR_API.PROFILE;
  constructor(private httpClient: HttpClient) {}

  requestEditMentorData(formData: any): Observable<IErrorResponse> {
    return this.httpClient
      .put<IErrorResponse>(`${this.api}/updateMentorData`, formData)
      .pipe(
        map((response) => response as IErrorResponse),
        catchError((err) => throwError(err.message ? err.message : err))
      );
  }

  requestGetFeedbackRatings(mentorId: string): Observable<IComment[]> {
    return this.httpClient.get<IComment[]>(`${this.api}/getFeedbackRatings`, { params: { mentorId } })
    .pipe(catchError((err) => throwError(err.message ? err.message : err)))
    
}


}