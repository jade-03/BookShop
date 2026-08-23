import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  return authService.checkAuth().pipe(
    map((user) => {
      if (user) {
        return true;
      }

      return router.createUrlTree(['/login']);
    })
  );
};
