import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { MentorauthService } from '../services/mentor/mentorauth.service';

export const authMentorGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const authMentorService = inject(MentorauthService);
  const router = inject(Router);
  const mentorToken:string|null = localStorage.getItem('mentorToken');
  // console.log(accessToken)
   return authMentorService.verifyMentorAccess(mentorToken).pipe(
    map((response) => {
      localStorage.setItem('MentorData', JSON.stringify(response.mentorData));
      localStorage.setItem("mentorToken",response.accessToken);
       return true
   }),
   catchError(() =>{
    console.log("working")
    localStorage.removeItem('mentorToken');
    localStorage.removeItem('MentorData');
    router.navigate(['/mentor/login']);
    return of(false);
   })
  
  )
};