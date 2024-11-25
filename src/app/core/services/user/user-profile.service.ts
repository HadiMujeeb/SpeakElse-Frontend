import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { IMember, IUser } from '../../../shared/models/member.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IErrorResponse } from '../../../shared/models/error.model';
import { HttpClient } from '@angular/common/http';
import { IComment, IReponseRatings } from '../../../shared/models/friendsRating.model';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private api: string = `${environment.BACKEND_DOMAIN}/api/user`;
  constructor(private httpClient: HttpClient) {}

  requestEditMemberData(
    updatedData: IMember,
    file: File | null
  ): Observable<IErrorResponse> {
    const formData: FormData = new FormData();
    for (const key in updatedData) {
      if (
        updatedData.hasOwnProperty(key) &&
        updatedData[key as keyof IMember] !== undefined
      )
        formData.append(key, String(updatedData[key as keyof IMember]));
    }
    if (file) formData.append('image', file, file.name);

    return this.httpClient
      .post<IErrorResponse>(`${this.api}/updateMemberData`, formData)
      .pipe(
        map((response) => response as IErrorResponse),
        catchError((err) => throwError(err.message ? err.message : err))
      );
  }

  requestGetFriendRating(userId: string): Observable<IReponseRatings[]> {
    return this.httpClient.get<IReponseRatings[]>(`${this.api}/requestRetrieveRatings`, {params: {userId}});
  }

  requestGiveRating(data: IComment): Observable<IErrorResponse> {
    return this.httpClient.post<IErrorResponse>(`${this.api}/requestGiveRating`, data);
  }

  requestFollowUnFollow(userId: string,friendId: string): Observable<IErrorResponse> {
    console.log(userId,friendId);
    return this.httpClient.post<IErrorResponse>(`${this.api}/requestFollowUnfollow`, { userId , friendId });
  }

  requestGetAllFriends(userId: string): Observable<IUser[]> {
    return this.httpClient.get<IUser[]>(`${this.api}/requestRetrieveFriends`, {params: {userId}});
}
}