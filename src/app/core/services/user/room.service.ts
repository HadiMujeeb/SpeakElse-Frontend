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

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private api: string = `${environment.BACKEND_DOMAIN}/api/user`;
  private rooms = new BehaviorSubject<IRoom[]>([]);
  private filters = new BehaviorSubject<any>(null);


  room$ = this.rooms.asObservable();
  filters$ = this.filters.asObservable();


  sendRooms(rooms: IRoom[]): void {
    this.rooms.next(rooms);
  }

  updateFilters(filters: any): void {
    this.filters.next(filters); 
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

  requestVerifyPayment(transactionData:ITransaction): Observable<any> {
    return this.httpClient.post<any>(`${this.api}/requestPaymentTransation`, transactionData)
    .pipe(catchError((err) => throwError(() => new Error(err.error?.message))))
  }
 
}
