import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { IUserRegisterationCredentials, IRegisterSuccessfullResponse } from '../../models/auth/RegistrationForm.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {

  private api: string = `${environment.BACKEND_DOMAIN}/api/user`;

  constructor(public httpClient: HttpClient) { }

  RegisterationRequest(registerCredentails: IUserRegisterationCredentials): Observable<IRegisterSuccessfullResponse> {
    const url: string = `${this.api}/register`;
    console.log("working", registerCredentails);

    const registerAPIResponse$: Observable<IRegisterSuccessfullResponse> = this.httpClient.post<IRegisterSuccessfullResponse>(url, registerCredentails)
      .pipe(
        catchError((err: any) => {
          console.error('Error during registration:', err.error?.message || 'Unknown error occurred');
          return throwError(() => new Error(err.message || "Server Error"));
        })
      );

    return registerAPIResponse$;
  }
}