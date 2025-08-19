import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, Subscription } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { PostMethods } from '../common/endpoints';




@Injectable({
    providedIn: 'root'
})
export class LinesService {
    private api = inject(ApiService);
    private base = environment.linesApiUrl;

    getActiveLeagues(payload: any): Observable<any[]> {
        const url = `${this.base}${PostMethods.GET_SPLIT_SCHEDULE}`;
        return this.api.apiPostMethod(url, payload).pipe(
            map(res => this.normalize(res)),
            catchError(err => {
                console.error('[LinesService] getActiveLeagues', err);
                return of([]);
            })
        );
    }

    private normalize(res: any): any[] {
        if (!res) return [];
        // si viene agrupado { Group: { Leagues: [...] } } o [ { Leagues: [...]}, ... ]
        if (Array.isArray(res)) {
            if (res.length && res[0]?.Leagues) return res.flatMap((g: any) => g.Leagues || []);
            return res;
        }
        if (res.Leagues) return Array.isArray(res.Leagues) ? res.Leagues : [res.Leagues];
        // fallback: si la API devuelve algo distinto, intenta devolver lo útil
        if (res.data?.Leagues) return res.data.Leagues;
        return [];
    }

}