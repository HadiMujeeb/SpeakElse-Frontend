
import { Routes } from '@angular/router';
import { RegisterComponent } from '../app/features/components/authentication/user/register/register.component';
import { OTPComponent } from '../app/features/components/authentication/user/otp/otp.component';
import { LoginComponent } from '../app/features/components/authentication/user/login/login.component';
export const authRoutes: Routes = [
    {
        path: 'auth/login',
        component: LoginComponent
    },
    {
        path: 'auth/register',
        component: RegisterComponent
    },
    {
        path: 'auth/otp',
        component: OTPComponent
    },

];
