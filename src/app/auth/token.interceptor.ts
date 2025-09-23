// auth/token.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  console.log('Retrieved token from sessionStorage:', token);
  // Skip attaching token for login endpoint
  if (token && !req.url.endsWith('/login')) {
    console.log('Attaching token to request:', token);
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req);
};
