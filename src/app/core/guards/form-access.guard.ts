// src/app/guards/form.guard.ts

import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { tap, Observable, map } from 'rxjs';
import { AuthUserService } from '../services/user/auth-user.service';
import { inject } from '@angular/core';

export const formGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const authService = inject(AuthUserService);
  const router = inject(Router);

  // Check if the user is logged in
  return authService.isUserExisted$().pipe(
    tap(isLoggedIn => {
      if (isLoggedIn) {
        // If logged in, redirect to the desired route (e.g., user home)
        router.navigate(['/user/home']); // Adjust the route as necessary
      }
    }),
    map(isLoggedIn => !isLoggedIn) // Allow access if not logged in; otherwise, prevent access
  );
};
