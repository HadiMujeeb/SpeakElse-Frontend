import { Routes } from '@angular/router';
import {userRoutes} from './user.routes' ;
import { authRoutes } from './authuser.routes';
import { adminRoutes } from './admin.routes';
export const routes: Routes = [
   ...userRoutes,
   ...authRoutes,
   ...adminRoutes,
];