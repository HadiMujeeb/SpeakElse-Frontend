import { Routes } from '@angular/router';
import { WelcomeComponent } from '../app/features/components/user/welcome/welcome.component';
// import { RegisterComponent } from '../app/shared/components/auth/register/register.component';

export const routes: Routes = [
    {
        path:'',
        component:WelcomeComponent
    },
    // {
    //     path:'register',
    //     component:RegisterComponent
    // },
    
];
