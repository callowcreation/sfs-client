import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TwitchLibService } from '../services/twitch-lib.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class TokenHeaderInterceptor implements HttpInterceptor {

    constructor(private twitchLib: TwitchLibService) { }

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (req.url.includes(environment.twitch.api)) {
            const clone = req.clone({
                headers: req.headers
                    .set('client-id', this.twitchLib.authorized$.value.clientId)
                    .set('Authorization', 'Extension ' + this.twitchLib.authorized$.value.helixToken)
            });
            return next.handle(clone);
        }
        return next.handle(req);
    }
}
