import { Routes } from '@angular/router';
import { LoginComponent } from '../app/features/user/login/login.component';
import { RegisterComponent } from '../app/features/user/register/register.component';
import { HomepageComponent } from '../app/features/user/homepage/homepage.component';
import { OTPComponent } from '../app/features/user/otp/otp.component';
import { ResetPasswordComponent } from '../app/features/user/resetpassword/resetpassword.component';
import { ResetPasswordMailComponent } from '../app/features/user/reset-password-mail/reset-password-mail.component';
import { AdminHeaderComponent } from '../app/layouts/admin/admin-header/admin-header.component';
import { MentorProfileComponent } from '../app/features/mentor/mentor-profile/mentor-profile.component';
import { AdminLoginComponent } from '../app/features/admin/admin-login/admin-login.component';
import { FormModalComponent } from '../app/shared/components/modals/form-modal/form-modal.component';
import { authAdminGuard } from '../app/core/guards/auth-admin.guard';
import { FormAdminGuard } from '../app/core/guards/form-admin.guard';
import { MentorapplicationComponent } from '../app/features/user/mentorapplication/mentorapplication.component';
import { RoomListComponent } from '../app/features/user/room-list/room-list.component';
import { CreateRoomModalComponent } from '../app/shared/components/modals/create-room-modal/create-room-modal.component';
import { authUserGuard } from '../app/core/guards/auth-user.guard';
import { RoomComponent } from '../app/features/user/room/room.component';
import { guestOnlyGuard } from '../app/core/guards/guestOnly.guard';
import { RatingComponent } from '../app/shared/components/rating/rating.component';
import { ChatSidebarComponent } from '../app/shared/components/video-conference/room-chat/chat-sidebar.component';
import { authAdminLoginGuard } from '../app/core/guards/auth-admin-login.guard';
import { CallendComponent } from '../app/shared/components/callend/callend.component';
import { MainContentComponent } from '../app/features/admin/main-content/main-content.component';
import { MembersComponent } from '../app/features/admin/members/members.component';
import { LanguageTestComponent } from '../app/features/admin/language-test/language-test.component';
import { MentorLoginComponent } from '../app/features/mentor/mentor-login/mentor-login.component';
import { MentorPofileSidebarComponent } from '../app/shared/components/mentor/mentor-pofile-sidebar/mentor-pofile-sidebar.component';
import { MainpageComponent } from '../app/features/mentor/mainpage/mainpage.component';
import { MentorPofileContentComponent } from '../app/features/mentor/mentor-pofile-content/mentor-pofile-content.component';
import { ApplicationFormComponent } from '../app/features/admin/application-form/application-form.component';
import { MentorProcessInfoComponent } from '../app/features/user/mentor-process-info/mentor-process-info.component';
import { ReadingTestComponent } from '../app/shared/components/reading-test/reading-test.component';
import { ListeningTaskComponent } from '../app/shared/components/listening-task/listening-task.component';
import { ScorepageComponent } from '../app/shared/components/scorepage/scorepage.component';
import { MentorSessionsComponent } from '../app/features/mentor/mentor-sessions/mentor-sessions.component';
import { authMentorGuard } from '../app/core/guards/auth-mentor.guard';
import { authMentorLoginGuard } from '../app/core/guards/auth-mentor-login.guard';
import { ReportsListComponent } from '../app/features/admin/reports-list/reports-list.component';
import { MentorWalletComponent } from '../app/features/mentor/mentor-wallet/mentor-wallet.component';
import { UserMainpageComponent } from '../app/features/user/user-mainpage/user-mainpage.component';
import { ProfileContentComponent } from '../app/shared/components/user/profile-content/profile-content.component';
import { ProfileComponent } from '../app/features/user/profile/profile.component';
import { UserWalletComponent } from '../app/features/user/user-wallet/user-wallet.component';
import { MentorsSesstionsComponent } from '../app/features/user/mentors-sesstions/mentors-sesstions.component';
import { AdminWalletComponent } from '../app/features/admin/admin-wallet/admin-wallet.component';
import { AdminDashboardComponent } from '../app/features/admin/admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from '../app/features/mentor/dashboard/dashboard.component';
import { MysessionComponent } from '../app/features/user/mysession/mysession.component';
import { MentorRoomComponent } from '../app/features/mentor/mentor-room/mentor-room.component';

export const routes: Routes = [
  { path: '', redirectTo: 'user/home', pathMatch: 'full' },
  {
    path: 'auth', canActivate: [guestOnlyGuard], children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'otp', component: OTPComponent },
      { path: 'set-new-password', component: ResetPasswordComponent },
      { path: 'forgot-password', component: ResetPasswordMailComponent },
    ]
  },
  {
    path: 'user', canActivate: [authUserGuard], children: [
      { path: 'home', component: HomepageComponent },
      { path: 'roomList', component: RoomListComponent },
      { path: 'mentorSessions', component: MentorsSesstionsComponent },
      { path: 'room/:roomId', component: RoomComponent },
      { path: 'interface', component: RatingComponent },
      { path: 'main', component: UserMainpageComponent, children: [
        { path: 'profile', component: ProfileContentComponent },
        { path: 'wallet', component: UserWalletComponent },
        {path:"mysession",component:MysessionComponent},
      ]},
      {path:'test',children:[
        {path:'readingTest',component:ReadingTestComponent},
        {path:'listeningTask',component:ListeningTaskComponent},
        {path:'scorePage',component:ScorepageComponent},
      ]},
      { path: 'applicationform', component: MentorapplicationComponent },
      {path:'instruction',component:MentorProcessInfoComponent},  
    ]
  },
  {
    path: 'mentor', children: [
      
      {path:'login',component:MentorLoginComponent,canActivate:[authMentorLoginGuard]},
      {path:'main',component:MainpageComponent,canActivate:[authMentorGuard],
        children:[
         { path: 'dashboard', component: DashboardComponent },
         { path: 'profile', component: MentorPofileContentComponent },
         { path: 'sessions', component: MentorSessionsComponent },
         { path: 'wallet', component: MentorWalletComponent },
      ]},
      { path: 'mentorRoom/:roomId', component: MentorRoomComponent },
    ]
  },
  {
    path: 'admin', children: [
      { path: 'login', component: AdminLoginComponent,canActivate: [authAdminLoginGuard] },
      { path: 'main',
         component: MainContentComponent,
         canActivate: [authAdminGuard],
         children: [
          {path:'dashboard',component:AdminDashboardComponent},
          {path:'members',component:MembersComponent},
          {path:'tests',component:LanguageTestComponent},
          {path:"applicationForm",component:ApplicationFormComponent},
          {path:'reports',component:ReportsListComponent},
          {path:'wallet',component:AdminWalletComponent},
         ]},
    ]
  },
  { path: '**', redirectTo: 'user/home' },
];
