import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment.development';
import { HttpClient } from '@angular/common/http';
import { IErrorResponse } from '../../shared/models/error.model';
import { Observable } from 'rxjs';
import { IChat, IMessage } from '../../shared/models/chat-message.model';
import { IMember } from '../../shared/models/member.model';
import { USER_API } from '../../../routes/routesFile';

@Injectable({
  providedIn: 'root'
})
export class FriendChatService {
  private api: string = USER_API.CHAT;
  constructor(private httpClient: HttpClient) {}

requestCreateChat(userId: string, friendId: string): Observable<IChat> {
  return this.httpClient.post<IChat>(`${this.api}/createChat`, { userId, friendId });
}

requestGetChat(userId: string, friendId: string): Observable<IChat> {
  return this.httpClient.get<IChat>(`${this.api}/getChat`, { params: { userId, friendId } });
}

requestGetAllChat(userId: string): Observable<IChat[]> {
  return this.httpClient.get<IChat[]>(`${this.api}/retrieveAllChats`, { params: { userId } });
}
requestSendMessage(data: IMessage): Observable<IErrorResponse> {
  return this.httpClient.post<IErrorResponse>(`${this.api}/sendMessage`, data);
}

}