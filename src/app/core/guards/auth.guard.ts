import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
 
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router      = inject(Router);
 
  if (authService.isLoggedIn()) {
    // Token exists in localStorage -> allow navigation
    return true;
  }
 
  // No token -> redirect to login
  return router.createUrlTree(['/login']);
};
