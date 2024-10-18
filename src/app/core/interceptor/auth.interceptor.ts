import { HttpEvent, HttpHandler, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { authTokenService } from '../services/user/auth-token.service';


export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next): Observable<HttpEvent<any>> => {
  const AuthTokenService = inject(authTokenService);
  const authToken = AuthTokenService.retrieveAuthToken();

  const clonedRequest = req.clone({ withCredentials: true });
  return next(clonedRequest); 


};
