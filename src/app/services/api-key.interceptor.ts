import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from "rxjs";

export const apiKeyInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {

    const requestClone = request.clone(
        {
            setHeaders: {
                'Authorization': ('Token '+sessionStorage.getItem('userToken')),
                apikey: 'dev'
            }
        }
    );
    return next(requestClone);
}
