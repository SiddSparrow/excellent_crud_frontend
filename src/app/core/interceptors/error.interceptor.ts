import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authService.logout();
      } else if (error.status === 403) {
        alert('Acesso negado. Voc\u00ea n\u00e3o tem permiss\u00e3o para esta a\u00e7\u00e3o.');
      }
      return throwError(() => error);
    })
  );
};
