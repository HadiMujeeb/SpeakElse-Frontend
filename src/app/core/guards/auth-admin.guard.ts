import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from '../services/admin/admin.service';
import { inject } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';

export const authAdminGuard: CanActivateFn = (route, state) => {
  const adminServices = inject(AdminService);
  const router = inject(Router);

  return adminServices.adminAuthTokenRequest().pipe(
   map((response: any) => {
     localStorage.setItem("adminData",JSON.stringify(response.adminData.adminData));
     localStorage.setItem("Token",response.accessToken);
      return true
  }),
  catchError(() =>{
   localStorage.removeItem('Token');
   localStorage.removeItem('adminData');
   router.navigate(['/admin/login']);
   return of(false);
  })
 
 )
};
