import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const userAccessToken = localStorage.getItem('USER_ACCESS_TOKEN');

    // Exclude /auth/login and /auth/signup from adding the Authorization header
    if (
      !request.url.includes('/auth/login') &&
      !request.url.includes('/auth/signup')
    ) {
      if (userAccessToken) {
        const clonedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        });

        return next.handle(clonedRequest);
      }
    }

    return next.handle(request);
  }
}
