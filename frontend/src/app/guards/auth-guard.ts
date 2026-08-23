import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { catchError, map, of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(Auth);

  return authService.profile().pipe(
    map((user) => {
      if (user.role === 'ROLE_ADMIN') {
        return true;
      }

      return router.createUrlTree(['/login-admin']
      );
    }),
    catchError(() => {
      return of(
        router.createUrlTree(['/login-admin'])
      );
    })
  );
};
