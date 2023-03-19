import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TwitchLibService } from '../services/twitch-lib.service';

@Injectable()
export class BackendHeaderInterceptor implements HttpInterceptor {

  constructor(private twitchLib: TwitchLibService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.url.includes(environment.backend.api)) {
        const clone = req.clone({
            headers: req.headers
                .set('Authorization', 'Bearer ' + this.twitchLib.authorized$.value.token)
        });
        return next.handle(clone);
    }
    return next.handle(req);
}
}
