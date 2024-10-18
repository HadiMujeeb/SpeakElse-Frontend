import { Routes } from '@angular/router';
import { ProfileComponent } from '../app/shared/components/profile/profile.component';
import { SettingsComponent } from '../app/shared/components/settings/settings.component';
import { HomepageComponent } from '../app/features/homepage/homepage.component';
import { authGuard } from '../app/core/guards/guards.guard';
import { ProfilepageComponent } from '../app/features/auth/profilepage/profilepage.component';
export const userRoutes: Routes = [
  {
    path: '',
    component: HomepageComponent,
   
  },
  {
    path: 'profile',
    component: ProfileComponent,

  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'profilepage',
    component: ProfilepageComponent,
    canActivate: [authGuard],
  },
];
