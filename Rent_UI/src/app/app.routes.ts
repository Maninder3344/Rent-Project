import { Routes } from '@angular/router';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    // component : LoginComponent,
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginPage),
  },
  {
    path: 'verifiyotp',
    loadComponent: () =>
      import('./auth/verifiyotp/verifiyotp.component').then(
        (m) => m.VerifiyotpComponent,
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./auth/signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./tab1/tab1.page').then((m) => m.Tab1Page),
    canActivate: [authGuard],
  },

  {
    path: 'room/:id',
    loadComponent: () =>
      import('./tab1/room/room.component').then((m) => m.RoomComponent),
    canActivate: [authGuard],
  },

  {
    path:'tenant/:id',
     loadComponent: () =>
      import('./tab1/tenant/tenant.component').then((m)=>m.TenantComponent),
      canActivate: [authGuard],
  }
];
