import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

// TODO re-check the implementation
export const universalInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('intercepting');
  return next(req).pipe(
    catchError((err: any) => {
      console.log(`inrecept`, JSON.stringify(err, null, 2));
      return throwError(() => err);
    }),
  );
};
