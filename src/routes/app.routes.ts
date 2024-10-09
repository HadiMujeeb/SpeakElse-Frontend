import { Routes } from '@angular/router';
import {userRoutes} from './user.routes' ;
import { authRoutes } from './authuser.routes';
export const routes: Routes = [
   ...userRoutes,
   ...authRoutes,
];