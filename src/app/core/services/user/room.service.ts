import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { IrequestCreateRoom, IRoom } from '../../../shared/models/room.model';
import {
  BehaviorSubject,
  catchError,
  Observable,
  Subject,
  throwError,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private api: string = `${environment.BACKEND_DOMAIN}/api/user`;
  private rooms = new BehaviorSubject<IRoom[]>([]);

  room$ = this.rooms.asObservable();
  sendRooms(rooms: IRoom[]): void {
    this.rooms.next(rooms);
  }
  constructor(private httpClient: HttpClient) {}

  requestAddRoom(data: IrequestCreateRoom): Observable<IRoom> {
    console.log('working requestAddRoom');
    return this.httpClient
      .post<IRoom>(`${this.api}/createRoom`, data)
      .pipe(
        catchError((err) => throwError(() => new Error(err.error?.message)))
      );
  }

  requestGetAllRooms(): Observable<IRoom[]> {
    return this.httpClient
      .get<IRoom[]>(`${this.api}/retrieveAllRooms`)
      .pipe(
        catchError((err) => throwError(() => new Error(err.error?.message)))
      );
  }
}
