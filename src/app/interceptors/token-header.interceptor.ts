import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TwitchLibService } from '../services/twitch-lib.service';

@Injectable()
export class TokenHeaderInterceptor implements HttpInterceptor {

    constructor(private twitchLib: TwitchLibService) { }

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (req.url.includes('https://api.twitch.tv/helix')) {
            const clone = req.clone({
                headers: req.headers
                    .set('client-id', '0ghp1wfzi7hdp144bpwagh9q86xjkg')
                    .set('Authorization', 'Extension ' + this.twitchLib.auth.helixToken)
            });
            return next.handle(clone);
        }
        return next.handle(req);
    }
}
