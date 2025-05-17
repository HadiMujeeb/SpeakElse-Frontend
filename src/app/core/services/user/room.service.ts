import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { IReponseCreatedRoom, IrequestCreateRoom, IResponseGellAllRoom, IRoom, IUserCreatedRoom } from '../../../shared/models/room.model';
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
  private paymentapi:string = USER_API.WALLET
  private rooms = new BehaviorSubject<IUserCreatedRoom[]>([]);
  private filters = new BehaviorSubject<any>(null);
  private createRoom = new Subject<IUserCreatedRoom>();
  private memberType = new BehaviorSubject<string | null>(this.getMemberTypeFromStorage());


  room$ = this.rooms.asObservable();
  filters$ = this.filters.asObservable();
  createRoom$ = this.createRoom.asObservable();
  memberType$ = this.memberType.asObservable();
    setMemberType(type: string): void {
    localStorage.setItem('memberType', type);
    this.memberType.next(type);
  }

  getMemberType(): string | null {
  const type = localStorage.getItem('memberType');
  this.memberType.next(type);
  return type;
}

  removeMemberType(): void {
    localStorage.removeItem('memberType');
    this.memberType.next(null);
  }

  private getMemberTypeFromStorage(): string | null {
    return localStorage.getItem('memberType');
  }

  sendRooms(rooms: IUserCreatedRoom[]): void {
    this.rooms.next(rooms);
  }

  sendCreateRoom(room: IUserCreatedRoom): void {
    this.createRoom.next(room);
    this.addRoom(room);  // Add new room to the service state
  }

  // Add a new room to the list
  private addRoom(newRoom: IUserCreatedRoom): void {
    const currentRooms =  this.rooms.getValue();
    this.rooms.next([...currentRooms, newRoom]);  // Add new room and emit updated list
  }

  updateRoomWithParticipant(roomId: string, participantId: string,count:number): void {
    const currentRooms = this.rooms.getValue();
    const updatedRooms = currentRooms.map(room => {
      if (room.id === roomId) {
        if(count==1){
          return {
            ...room,
            peopleCount: {
              ...room.peopleCount,
              joined: room.peopleCount.joined + 1,
            },
            participants: [...room.participants, participantId],
          };
        }else{
          return {
            ...room,
            peopleCount: {
              ...room.peopleCount,
              joined: room.peopleCount.joined - 1,
            },
            participants: [...room.participants],
          };
        }
        }
       
      return room;
    });
    this.rooms.next(updatedRooms);
  }
  


  updateFilters(filters: any): void {
    this.filters.next(filters); 
  }
  constructor(private httpClient: HttpClient) {}

  requestAddRoom(data: IrequestCreateRoom): Observable<IReponseCreatedRoom> {
    return this.httpClient.post<IReponseCreatedRoom>(`${this.api}/createRoom`, data)
    .pipe(catchError((err) => throwError(() => new Error(err.error?.message))));
  }
  // requestGetAllRooms(page: number = 1, pageSize: number = 6): Observable<{ message: string, rooms: IRoom[], totalPages: number,total: number }> {
  //   return this.httpClient
  //     .get<{ message: string, rooms: IRoom[], totalPages: number,total: number }>(`${this.api}/retrieveAllRooms?page=${page}&pageSize=${pageSize}`)
  //     .pipe(
  //       catchError((err) => {
  //         return throwError(() => new Error(err.error?.message || 'An error occurred while fetching rooms'));
  //       })
  //     );
  // }

  requestGetAllRooms():Observable<IResponseGellAllRoom>{
  return this.httpClient.get<IResponseGellAllRoom>(`${this.api}/retrieveAllRooms`)
  .pipe(catchError((err) => {return throwError(() => new Error(err.error?.message || 'An error occurred while fetching rooms'));}));
  }

  requestVerifyPayment(transactionData:ITransaction): Observable<any> {
    return this.httpClient.post<any>(`${this.paymentapi}/requestPaymentTransation`, transactionData)
    .pipe(catchError((err) => throwError(() => new Error(err.error?.message))))
  }

  requestRoomById(roomId: string): Observable<IRoom[]> {
    return this.httpClient.get<IRoom[]>(`${this.api}/retrieveRoomById/${roomId}`)
    .pipe(catchError((err) => throwError(() => new Error(err.error?.message))));
  }
}
