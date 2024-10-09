import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { IUserRegisterationCredentials, IRegisterSuccessfullResponse } from '../../../models/auth/RegistrationForm.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {

  private api: string = `${environment.BACKEND_DOMAIN}/api/user`;

  constructor(public httpClient: HttpClient) { }

  RegisterationRequest(registerCredentails: IUserRegisterationCredentials): Observable<IRegisterSuccessfullResponse> {
    const url: string = `${this.api}/register`;

    const registerAPIResponse$: Observable<IRegisterSuccessfullResponse> = this.httpClient.post<IRegisterSuccessfullResponse>(url, registerCredentails)
      .pipe(
        catchError((err: any) => {
          return throwError(() => new Error(err.error?.userExists || "Server Error"));
        })
      );

    return registerAPIResponse$;
  }

  


}