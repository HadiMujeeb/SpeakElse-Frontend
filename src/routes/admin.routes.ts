import { Routes } from '@angular/router';
import { AdminLoginComponent } from '../app/features/components/authentication/admin/admin-login/admin-login.component';

export const adminRoutes:Routes =[
    {
        path:'admin/auth/login',
        component:AdminLoginComponent
    }
]