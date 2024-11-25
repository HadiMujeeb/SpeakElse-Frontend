import { CanActivateFn, Router } from '@angular/router';
import { AuthUserService } from '../services/user/auth-user.service';
import { catchError, map, Observable, of } from 'rxjs';
import { inject } from '@angular/core';

export const authUserGuard: CanActivateFn = (route, state) : Observable<boolean> => {
  const authService = inject(AuthUserService);
  const router = inject(Router);
  const accessToken:string|null = localStorage.getItem('accessToken');
  // console.log(accessToken)
   return authService.getProtectedData(accessToken).pipe(
    map((response) => {
      localStorage.setItem("userData",JSON.stringify(response.user));
      localStorage.setItem("accessToken",response.accessToken);
      authService.setLoggedInStatus(true)
       return true
   }),
   catchError(() =>{
    console.log("working")
    authService.setLoggedInStatus(false)
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    console.log(state.url,"url")
    if(state.url!=="/user/home"){
      router.navigateByUrl("auth/login")
    }
    return of(true);
   })
  
  )
};
