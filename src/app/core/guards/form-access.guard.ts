import { Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthUserService } from '../services/user/auth-user.service';
import { inject } from '@angular/core';
import { Subscription } from 'rxjs';
export const formGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const authService = inject(AuthUserService);
  const router = inject(Router);


  return of(true);
};
