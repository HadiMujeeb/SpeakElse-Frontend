import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from '../services/admin/admin.service';
import { inject } from '@angular/core';
import { map, tap } from 'rxjs';

export const FormAdminGuard: CanActivateFn = (route, state) => {
  const adminServices = inject(AdminService);
  const router = inject(Router);


  return adminServices.isAdminExisted$().pipe(
    tap(isAdmin => {
      if (isAdmin) {
        router.navigate(['/admin/member']); 
      }
    }),
    map(isAdmin => !isAdmin) // Return true if admin exists, otherwise false
  );
};