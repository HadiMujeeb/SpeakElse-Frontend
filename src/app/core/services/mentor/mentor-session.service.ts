import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { IMentorRoom, IReshedulement, IResponseMentorRoom } from '../../../shared/models/mentorform.model';
import { MENTOR_API } from '../../../../routes/routesFile';

@Injectable({
  providedIn: 'root'
})
export class MentorSessionService {

  private api: string = MENTOR_API.ROOM;
   constructor(private httpClient: HttpClient) {}

  requestCreateSession(data:IMentorRoom): Observable<IMentorRoom> {
    return this.httpClient.post<IMentorRoom>(`${this.api}/requestcreateRoom`, data)
    .pipe(catchError((err) => throwError(err.message ? err.message : err)))
  }
  
  requestGetAllSessions(): Observable<IResponseMentorRoom> {
    return this.httpClient.get<IResponseMentorRoom>(`${this.api}/requestgetAllRooms`)
    .pipe(catchError((err) => throwError(err.message ? err.message : err)))
  }

  requestGetSessionByMentorId(mentorId: string): Observable<IMentorRoom> {
    return this.httpClient.get<IMentorRoom>(`${this.api}/getAllRoomsByMentorId/${mentorId}`)
    .pipe(catchError((err) => throwError(err.message ? err.message : err)))
}
requestResheduleSession(data: IReshedulement): Observable<any> {
  return this.httpClient.put<any>(`${this.api}/reqRescheduleMentorSession`, data)
    .pipe(catchError((err) => throwError(err.message ? err.message : err)));
}
requestCancelSession(roomId: string, mentorId: string): Observable<any> {
  return this.httpClient.put<any>(`${this.api}/cancelMentorSession`, { roomId , mentorId})
    .pipe(catchError((err) => throwError(err.message ? err.message : err)));
}
}