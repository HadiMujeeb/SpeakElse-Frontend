import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { HttpClient } from '@angular/common/http';
import { ITransaction } from '../../../shared/models/friendsRating.model';
import { catchError, Observable, throwError } from 'rxjs';
import { USER_API } from '../../../../routes/routesFile';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private api: string = USER_API.WALLET;
  constructor(private httpClient: HttpClient) { }

  requestGellAllTransactions(userId: string): Observable<ITransaction[]> {
    return this.httpClient.get<ITransaction[]>(`${this.api}/requestGetAllTransactions`,{params: {userId}})
    .pipe(catchError((err) => throwError(() => new Error(err.error?.message || 'Unknown error occurred'))));
  }
  requestRefundTransaction(transactionData:ITransaction): Observable<ITransaction[]> {
    return this.httpClient.post<ITransaction[]>(`${this.api}/requestRefundSessionAmount`, transactionData)
    .pipe(catchError((err) => throwError(() => new Error(err.error?.message))));
}
} 