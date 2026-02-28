import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
 
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
 
  // Read token from localStorage
  const token = localStorage.getItem('pg_token');
 
  // Clone the request and add Authorization header if token exists
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;
 
  // Send the request and watch for errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 = token expired or invalid -> force logout
      if (error.status === 401) {
        localStorage.removeItem('pg_token');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
