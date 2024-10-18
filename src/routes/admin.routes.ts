import { Routes } from '@angular/router';
import { AdminLoginComponent } from '../app/features/auth/admin/admin-login/admin-login.component';

export const adminRoutes: Routes = [
  {
    path: 'admin/auth/login',
    component: AdminLoginComponent,
  },
];
