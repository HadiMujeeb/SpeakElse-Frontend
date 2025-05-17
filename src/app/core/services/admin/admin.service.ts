import { Injectable } from '@angular/core'; 
import { environment } from '../../../../environment/environment.development'; 
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { catchError, Observable, of, throwError } from 'rxjs';
import { IadminauthResponse, IProtectedDataResponse } from '../../../shared/models/protected-data-response.model';

@Injectable({ providedIn: 'root' }) 
export class AdminService { 
  private api: string = `${environment.BACKEND_DOMAIN}/api/admin`; 
  constructor(private httpClient: HttpClient) {}

  isAdminExisted$(): Observable<boolean> { 
    const admin = localStorage.getItem('adminData'); 
    return of(admin !== null); 
  }

  adminLogin(email: string, password: string): Observable<any> {
    const body = { email, password }; 
    return this.httpClient.post(`${this.api}/adminLogin`, body).pipe(
      catchError(err => throwError(() => new Error(err.error?.message || "UNKNOWN ERROR")))
    );
  }

  adminAuthTokenRequest(): Observable<IadminauthResponse> {
    return this.httpClient.get<IadminauthResponse>(`${this.api}/adminAuthToken`)
      .pipe(catchError((err) => throwError(() => new Error(err.error?.message || 'Unknown error occurred'))));
  }

  requestLogoutAdmin():Observable<any> {
    return this.httpClient.get(`${this.api}/adminLogout`)
      .pipe(catchError((err) => throwError(() => new Error(err.error?.message || 'Logout Failed'))));
  }
}
