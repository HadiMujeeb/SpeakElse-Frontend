import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { MentorauthService } from '../services/mentor/mentorauth.service';

export const authMentorLoginGuard: CanActivateFn = (route, state) :Observable<boolean> => {
  const authMentorService = inject(MentorauthService);
  const router = inject(Router);

  return authMentorService.isMentorExisted$().pipe(
    map(isMentor => {
      if (isMentor) {
        router.navigate(['/mentor/main']);
        return false;
      } else {
        return true;
    }})
  )
};
