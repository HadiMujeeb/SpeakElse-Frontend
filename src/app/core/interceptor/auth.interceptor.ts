import { HttpEvent, HttpHandler, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next): Observable<HttpEvent<any>> => {
   const token = localStorage.getItem('Token');
  let clonedRequest = req.clone({ withCredentials: true });
   if (token) {
    clonedRequest = clonedRequest.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(clonedRequest); 
};
