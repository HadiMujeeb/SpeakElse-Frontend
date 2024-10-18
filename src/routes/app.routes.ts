import { Routes } from '@angular/router';
import {userRoutes} from './user.routes' ;
import { authRoutes } from './authuser.routes';
import { adminRoutes } from './admin.routes';
import { LoginComponent } from '../app/features/auth/user/login/login.component';
import { RegisterComponent } from '../app/features/auth/user/register/register.component';
import { HomepageComponent } from '../app/features/homepage/homepage.component';
import { authGuard } from '../app/core/guards/guards.guard';
import { formGuard } from '../app/core/guards/form-access.guard';
import { OTPComponent } from '../app/features/auth/user/otp/otp.component';
import { ResetPasswordComponent } from '../app/features/auth/user/resetpassword/resetpassword.component';
import { ResetPasswordMailComponent } from '../app/features/auth/reset-password-mail/reset-password-mail.component';
export const routes: Routes = [
   {
      path: 'auth',
      children: [
        { path: 'login', component: LoginComponent,  canActivate: [formGuard], },
        { path: 'register', component: RegisterComponent,canActivate: [formGuard], },
        { path:  'otp' , component:OTPComponent},
        { path:  'resetpassword' , component:ResetPasswordComponent},
        { path:  'resetlink' , component:ResetPasswordMailComponent},

      ]
    },
    {
      path:'',component:HomepageComponent,
      canActivate: [authGuard],
    }
]