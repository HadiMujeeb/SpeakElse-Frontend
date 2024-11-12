import { CanActivateFn, Router } from '@angular/router';
import { AuthUserService } from '../services/user/auth-user.service';
import { catchError, map, Observable, of } from 'rxjs';
import { inject } from '@angular/core';

export const authUserGuard: CanActivateFn = (route, state) : Observable<boolean> => {
  const authService = inject(AuthUserService);
  const router = inject(Router);
  const accessToken:string|null = localStorage.getItem('accessToken');
   return authService.getProtectedData(accessToken).pipe(
    map((response) => {
     if(response.status == 200 || response.status == 304) {
      localStorage.setItem("userData",JSON.stringify(response.user));
      localStorage.setItem("accessToken",response.accessToken);
       router.navigateByUrl('/user/home')
       return false
     }else {
      console.log('user not login')
      return true
     }
   }),
   catchError(() =>{
    return of(true);
   })
  
  )

  
};
