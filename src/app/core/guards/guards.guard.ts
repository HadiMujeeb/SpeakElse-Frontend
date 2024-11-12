import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthUserService } from '../services/user/auth-user.service';

export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const authService = inject(AuthUserService);
  const router = inject(Router);
 const accessToken:string|null = localStorage.getItem('accessToken');
  return authService.getProtectedData(accessToken).pipe(
    map((response) => {

      

      if (response.status == 200 || response.status == 304) {
        localStorage.setItem("userData",JSON.stringify(response.user));
        localStorage.setItem("accessToken",response.accessToken);
        authService.isLoggedInSubject.next(true);
        return true;
      }

      authService.isLoggedInSubject.next(false);
      return true;
    }),
    catchError(() => {
      localStorage.removeItem("userData");
      authService.isLoggedInSubject.next(false);
      return of(true);
    })
  );
};
