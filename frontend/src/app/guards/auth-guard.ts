import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Auth } from '../services/auth';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookieService = inject(CookieService);
  const authService = inject(Auth)

  const role = cookieService.get('role');

  if (role === 'ROLE_ADMIN') {
    return true;
  }

  return authService.checkAuth().pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return true;
      }

      return router.createUrlTree(['/login']);
    })
  );
};
