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
import { FormModalComponent } from '../app/shared/components/form-modal/form-modal.component';
import { authAdminGuard } from '../app/core/guards/auth-admin.guard';
import { FormAdminGuard } from '../app/core/guards/form-admin.guard';
import { MentorapplicationComponent } from '../app/features/mentor/mentorapplication/mentorapplication.component';
import { RoomListComponent } from '../app/features/user/room-list/room-list.component';
import { RoominterfaceComponent } from '../app/features/user/roominterface/roominterface.component';
import { CreateRoomModalComponent } from '../app/shared/components/create-room-modal/create-room-modal.component';
import { authUserGuard } from '../app/core/guards/auth-user.guard';
import { userProfileGuard } from '../app/core/guards/user-profile.guard';
import { RoomComponent } from '../app/features/user/room/room.component';
import { RoomPreviewComponent } from '../app/features/user/room-preview/room-preview.component';


export const routes: Routes = [
  { path: '', redirectTo: 'user/home', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent ,canActivate: [authUserGuard] },
      {
        path: 'register',
        component: RegisterComponent ,canActivate: [authUserGuard],
        
      },
      { path: 'otp', component: OTPComponent },
      {
        path: 'set-new-password',
        component: ResetPasswordComponent,canActivate: [authUserGuard],
        
      },
      {
        path: 'forgot-password',
        component: ResetPasswordMailComponent,canActivate: [authUserGuard],
      },
    ],
  },

  {
    path: 'user',
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomepageComponent},
      {path: 'profile',component: ProfileComponent ,canActivate:[userProfileGuard ]},
      {path: 'roomList',component:RoomListComponent},
      {path:'room/:roomId',component:RoomComponent},
      {path:'landing/:roomId',component:RoomPreviewComponent}
    ],
  },
  {
    path: 'mentor',
    children: [
      { path: 'profile', component: MentorProfileComponent,canActivate: [authGuard] },
      { path: 'applicationform', component: MentorapplicationComponent,canActivate: [authGuard] },
    ],
  },

  {
    path: 'admin',
    children: [
      {
        path: 'login',
        component: AdminLoginComponent,
        canActivate: [authUserGuard],
      },
      {
        path: 'member',
        component: AdminDashboardComponent,
        canActivate: [authAdminGuard],
      },
    ],
  },
];
