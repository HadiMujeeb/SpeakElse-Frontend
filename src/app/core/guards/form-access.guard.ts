// src/app/guards/form.guard.ts

import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { tap, Observable, map } from 'rxjs';
import { AuthUserService } from '../services/user/auth-user.service';
import { inject } from '@angular/core';

export const formGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const authService = inject(AuthUserService);
  const router = inject(Router);


  return authService.isUserExisted$().pipe(
    tap(isLoggedIn => {
      if (isLoggedIn) {
        router.navigate(['/user/home']);
      }
    }),
    map(isLoggedIn => !isLoggedIn)
  );
};
