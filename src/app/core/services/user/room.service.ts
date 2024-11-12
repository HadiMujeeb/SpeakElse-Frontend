import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { IrequestCreateRoom, IRoom } from '../../../shared/models/room.interface';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private api: string = `${environment.BACKEND_DOMAIN}/api/user`;
  constructor( private httpClient:HttpClient) { }

  requestAddRoom(data: IrequestCreateRoom): Observable<any> {
    return this.httpClient.post(`${this.api}/createRoom`, data)
      .pipe(catchError(err => throwError(() => new Error(err.error?.message))));
  }


  requestGetAllRooms(): Observable<IRoom[]> {
    return this.httpClient.get<IRoom[]>(`${this.api}/retrieveAllRooms`)
      .pipe(catchError(err => throwError(() => new Error(err.error?.message))));
  }
}  

