// src/app/guards/form.guard.ts

import { CanActivateFn, Router } from '@angular/router';
import { AuthUserService } from '../services/user/auth-user.service';
import { inject } from '@angular/core';
import { map, Observable, of } from 'rxjs';

export const guestOnlyGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const authService = inject(AuthUserService);
  const router = inject(Router);

  return authService.isUserExisted$().pipe(
    map((isUserExisted) => {
      if (isUserExisted) {
        router.navigateByUrl("user/home");
        return false;
      } else {
        return true;
      }
    })
  );
};
