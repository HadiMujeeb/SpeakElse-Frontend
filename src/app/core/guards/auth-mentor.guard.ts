import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { MentorauthService } from '../services/mentor/mentorauth.service';

export const authMentorGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const authMentorService = inject(MentorauthService);
  const router = inject(Router);
   return authMentorService.verifyMentorAccess().pipe(
    map((response) => {
      localStorage.setItem('mentorData', JSON.stringify(response.mentorData));
      localStorage.setItem("Token",response.accessToken);
       return true
   }),
   catchError(() =>{
    localStorage.removeItem('Token');
    localStorage.removeItem('mentorData');
    router.navigate(['/mentor/login']);
    return of(false);
   })
  
  )
};
