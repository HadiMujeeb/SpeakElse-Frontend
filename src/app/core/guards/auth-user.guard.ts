import { CanActivateFn, Router } from '@angular/router';
import { AuthUserService } from '../services/user/auth-user.service';
import { catchError, map, Observable, of } from 'rxjs';
import { inject } from '@angular/core';

export const authUserGuard: CanActivateFn = (route, state) : Observable<boolean> => {
  const authService = inject(AuthUserService);
  const router = inject(Router);
   return authService.getProtectedData().pipe(
    map((response) => {
      localStorage.setItem("userData",JSON.stringify(response.user));
      localStorage.setItem("Token",response.accessToken);
      authService.setLoggedInStatus(true)
       return true
   }),
   catchError(() =>{
    authService.setLoggedInStatus(false)
    localStorage.removeItem('Token');
    localStorage.removeItem('userData');
    console.log(state.url,"url")
    if(state.url!=="/user/home"){
      router.navigateByUrl("auth/login")
    }
    return of(true);
   })
  
  )
};
