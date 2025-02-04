import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // console.log(authService.user_logged_in)
  if (authService.user_logged_in && authService.is_token_valid()) {

    return true;
  }

  // Redirect to the login page
  alert("Die Seite ist nur für eingeloggte User sichtbar.")
  return router.parseUrl('/');
};
