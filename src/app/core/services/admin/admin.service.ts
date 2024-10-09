import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ReturnStatement } from '@angular/compiler';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private api: string = `${environment.BACKEND_DOMAIN}/api/admin`;
  constructor(private httpClient:HttpClient) { }

  adminLogin(email: string, password: string): Observable<any> {
    const url = `${this.api}/adminLogin`;
    const body = { email, password };

    const adminLoginAPIResponse$ =this.httpClient.post(url,body)
    .pipe(
      catchError((err:any)=>{
        return throwError(()=> new Error(err.error?.message)||"UNKOWN ERROR")
      })
    )

    return adminLoginAPIResponse$
  }

}
