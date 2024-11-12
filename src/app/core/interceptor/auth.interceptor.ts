import { HttpEvent, HttpHandler, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next): Observable<HttpEvent<any>> => {

  const clonedRequest = req.clone({ withCredentials: true });
  return next(clonedRequest); 
};
