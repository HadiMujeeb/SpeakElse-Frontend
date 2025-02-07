import { Injectable } from '@angular/core'; 
import { environment } from '../../../../environment/environment.development'; 
import { IMember, IUser } from '../../../shared/models/member.model'; 
import { BehaviorSubject, catchError, map, Observable, Subject, throwError } from 'rxjs'; 
import { IErrorResponse } from '../../../shared/models/error.model'; 
import { HttpClient } from '@angular/common/http'; 
import { IComment, IReponseRatings, IReport, ITransaction } from '../../../shared/models/friendsRating.model'; 
import { IQuestions } from '../../../shared/models/languageTests.model'; 
import { USER_API } from '../../../../routes/routesFile';

@Injectable({ providedIn: 'root' }) 
export class UserProfileService { 
  private api: string = USER_API.PROFILE; 
  private readingTestScore = new BehaviorSubject<number>(0); 
  private listeningTestScore = new BehaviorSubject<number>(0); 
  private listeningTime = new Subject<string>(); 
  private readingTime = new Subject<string>(); 
  constructor(private httpClient: HttpClient) {}

  readingTestScore$ = this.readingTestScore.asObservable(); 
  listeningTestScore$ = this.listeningTestScore.asObservable(); 
  listeningTime$ = this.listeningTime.asObservable(); 
  readingTime$ = this.readingTime.asObservable();

  updateReadingTestScore(score: number): void { this.readingTestScore.next(score); } 
  updateListeningTestScore(score: number): void { this.listeningTestScore.next(score); } 
  upateListeningTime(time: string): void { console.log(time); this.listeningTime.next(time); } 
  upateReadingTime(time: string): void { this.readingTime.next(time); }

  requestEditMemberData(updatedData: IMember, file: File | null): Observable<IErrorResponse> { 
    const formData: FormData = new FormData(); 
    for (const key in updatedData) { 
      if (updatedData.hasOwnProperty(key) && updatedData[key as keyof IMember] !== undefined) 
        formData.append(key, String(updatedData[key as keyof IMember])); 
    } 
    if (file){
      formData.append('image', file, file.name)   
    } 
    return this.httpClient.post<IErrorResponse>(`${this.api}/updateMemberData`, formData).pipe( 
      map((response) => response as IErrorResponse), 
      catchError((err) => throwError(err.message ? err.message : err)) 
    ); 
  }

  requestGetFriendRating(userId: string): Observable<IReponseRatings[]> { 
    return this.httpClient.get<IReponseRatings[]>(`${this.api}/requestRetrieveRatings`, { params: { userId } }); 
  }

  requestGiveRating(data: IComment): Observable<IErrorResponse> { 
    return this.httpClient.post<IErrorResponse>(`${this.api}/requestGiveRating`, data); 
  }

  requestFollowUnFollow(userId: string, friendId: string): Observable<IErrorResponse> { 
    console.log(userId, friendId); 
    return this.httpClient.post<IErrorResponse>(`${this.api}/requestFollowUnfollow`, { userId, friendId }); 
  }

  requestGetAllFriends(userId: string): Observable<IUser[]> { 
    return this.httpClient.get<IUser[]>(`${this.api}/requestRetrieveFriends`, { params: { userId } }); 
  }

  getAllQuestions(): Observable<IQuestions[]> { 
    return this.httpClient.get<IQuestions[]>(`${this.api}/getAllQuestions`); 
  }

  requestReportUser(formData: any): Observable<IErrorResponse> { 
    return this.httpClient.post<IErrorResponse>(`${this.api}/requestreportUser`, formData).pipe( 
      catchError((err) => throwError(() => new Error(err.error?.message || 'Report Failed'))) 
    ); 
  } 
}
