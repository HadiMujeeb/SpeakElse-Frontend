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
import { ITransaction } from '../../../shared/models/friendsRating.model';
import { USER_API } from '../../../../routes/routesFile';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private api: string = USER_API.ROOM;
  private rooms = new Subject<IRoom[]>();
  private filters = new BehaviorSubject<any>(null);
  private createRoom = new Subject<IRoom>();


  room$ = this.rooms.asObservable();
  filters$ = this.filters.asObservable();
  createRoom$ = this.createRoom.asObservable();


  sendRooms(rooms: IRoom[]): void {
    this.rooms.next(rooms);
  }

  sendCreateRoom(room: IRoom): void {
    this.createRoom.next(room);
  }

  updateFilters(filters: any): void {
    this.filters.next(filters); 
  }
  constructor(private httpClient: HttpClient) {}

  requestAddRoom(data: IrequestCreateRoom): Observable<IRoom> {
    return this.httpClient
      .post<IRoom>(`${this.api}/createRoom`, data)
      .pipe(
        catchError((err) => throwError(() => new Error(err.error?.message)))
      );
  }
  requestGetAllRooms(page: number = 1, pageSize: number = 6): Observable<{ message: string, rooms: IRoom[], totalPages: number,total: number }> {
    return this.httpClient
      .get<{ message: string, rooms: IRoom[], totalPages: number,total: number }>(`${this.api}/retrieveAllRooms?page=${page}&pageSize=${pageSize}`)
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(err.error?.message || 'An error occurred while fetching rooms'));
        })
      );
  }

  requestVerifyPayment(transactionData:ITransaction): Observable<any> {
    return this.httpClient.post<any>(`${this.api}/requestPaymentTransation`, transactionData)
    .pipe(catchError((err) => throwError(() => new Error(err.error?.message))))
  }

  requestRoomById(roomId: string): Observable<IRoom[]> {
    return this.httpClient.get<IRoom[]>(`${this.api}/retrieveRoomById/${roomId}`)
    .pipe(catchError((err) => throwError(() => new Error(err.error?.message))));
  }
}
