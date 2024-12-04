import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { StorageService } from '../../authentication/services/storage.service';

const TOKEN_HEADER_KEY = 'Authorization';
const CORS_HEADER = 'Access-Control-Allow-Origin';

@Injectable()
export class TokenInterceptorService {
  constructor(
    private tokenService: StorageService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const authReq = req.clone({
      setHeaders: {
        [TOKEN_HEADER_KEY]: 'Bearer ' + this.tokenService.getToken(),
      },
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.tokenService.doLogout()
        }
        return throwError(error);
      })
    );
  }
}

export const tokenInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true,
  },
];
