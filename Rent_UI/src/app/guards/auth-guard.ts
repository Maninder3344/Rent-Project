
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const isLoggedIn = sessionStorage.getItem('isLoggedIn');

  console.log('AUTH GUARD: Requested URL:', state.url);
  console.log('AUTH GUARD: Login flag:', isLoggedIn);

  if (isLoggedIn === 'true') {
    console.log('AUTH GUARD: Access allowed');
    return true;
  }

  console.log('AUTH GUARD: Redirecting to /login');

  return router.createUrlTree(['/login']);
};
