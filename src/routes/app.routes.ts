import { Routes } from '@angular/router';
import { LoginComponent } from '../app/features/auth/user/login/login.component';
import { RegisterComponent } from '../app/features/auth/user/register/register.component';
import { HomepageComponent } from '../app/features/homepage/homepage.component';
import { authGuard } from '../app/core/guards/guards.guard';
import { formGuard } from '../app/core/guards/form-access.guard';
import { OTPComponent } from '../app/features/auth/user/otp/otp.component';
import { ResetPasswordComponent } from '../app/features/auth/user/resetpassword/resetpassword.component';
import { ResetPasswordMailComponent } from '../app/features/auth/user/reset-password-mail/reset-password-mail.component';
import { AdminHeaderComponent } from '../app/layouts/admin/admin-header/admin-header.component';
import { AdminDashboardComponent } from '../app/features/admin/admin-dashboard/admin-dashboard.component';
import { ProfileComponent } from '../app/features/profile/profile.component';
import { MentorProfileComponent } from '../app/features/mentor/mentor-profile/mentor-profile.component';
import { Component } from '@angular/core';
import { AdminLoginComponent } from '../app/features/auth/admin/admin-login/admin-login.component';
import { FormModalComponent } from '../app/shared/reusable/modals/form-modal/form-modal.component';

export const routes: Routes = [
  {path:'',redirectTo:'user/home',pathMatch:'full'},
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent, canActivate: [formGuard] },
      {
        path: 'register',component: RegisterComponent, canActivate: [formGuard], },
      { path: 'otp', component: OTPComponent ,canActivate: [formGuard]},
      { path: 'resetpassword', component: ResetPasswordComponent ,canActivate: [formGuard]},
      { path: 'resetlink', component: ResetPasswordMailComponent ,canActivate: [formGuard]},
    ],
  },


  {
    path:'user',
    children:[
      {path:'home',component:HomepageComponent,canActivate: [authGuard],},
      {path:'profile',component:ProfileComponent,canActivate: [authGuard]},
    ]

  },
  {
    path:'mentor',
    children:[
      {path:'profile',component:MentorProfileComponent}
    ]

  },

  {
    path:'admin',
    children:[
      {path:"login",component:AdminLoginComponent},
      {path:'member',component:AdminDashboardComponent}
    ]
  }
];
