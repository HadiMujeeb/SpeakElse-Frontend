import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from '../services/admin/admin.service';
import { inject } from '@angular/core';
import { map, Observable } from 'rxjs';

export const authAdminLoginGuard: CanActivateFn = (route, state):Observable<boolean> => {
  const adminServices = inject(AdminService);
  const router = inject(Router);

  return adminServices.isAdminExisted$().pipe(
    map(isAdmin => {
      if (isAdmin) {
        router.navigate(['/admin/main/dashboard']);
        return false;
      } else {
        return true;
    }})
  )
};
