import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from '../services/admin/admin.service';
import { inject } from '@angular/core';
import { map, tap } from 'rxjs';

export const authAdminGuard: CanActivateFn = (route, state) => {
  const adminServices = inject(AdminService);
  const router = inject(Router);


  return adminServices.isAdminExisted$().pipe(
    tap(isAdmin => {
      if (!isAdmin) {
        router.navigate(['/admin/login']); // Redirect to login if not admin
      }
    }),
    map(isAdmin => isAdmin) // Return true if admin exists, otherwise false
  );
};