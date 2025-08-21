import { inject, Injectable } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { PostMethods } from '../common/endpoints';
import { HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class LinesService {
    private api = inject(ApiService);
    private baseLines = environment.linesApiUrl;
    subscription$: Subscription = new Subscription();
    originalLeagues: any[] = [];
    allLeagues: any[] = [];

    // leagues
    getLeagues() {
        const stored = sessionStorage.getItem('userData');
        const player = stored ? JSON.parse(stored) : { IdPlayer: 259818, Player: '' };

        const postData = {
            IdPlayer: player.IdPlayer,
            LeagueList: [724, 725, 176],
            NextHour: false,
            SiteId: 0
        };

        const url = `${environment.linesApiUrl + PostMethods.GET_MENU_LEAGUES}`;

        this.subscription$.add(
            this.api.apiPostMethod(url, postData).subscribe({
                next: (result: any) => {
                    if (!result) return;

                    const payload = result.MenuRegionTree ?? result.Sports ?? result;

                    this.originalLeagues = Array.isArray(payload) ? payload : [];
                    this.allLeagues = [...this.originalLeagues];

                    // intenta seleccionar la primera liga disponible (si existe)
                    const firstLeague = this.findFirstLeague(this.allLeagues);
                    if (firstLeague?.LeagueId || firstLeague?.IdLeague || firstLeague?.Id) {
                        const id = firstLeague.LeagueId ?? firstLeague.IdLeague ?? firstLeague.Id;
                        this.selectLeague(id);
                    }
                },
                error: (err: any) => {
                    console.error('getLeagues error', err);
                }
            })
        );
    }

    private findFirstLeague(items: any[]): any | null {
        if (!Array.isArray(items)) return null;
        for (const it of items) {

            if (Array.isArray(it.Leagues) && it.Leagues.length) {
                return it.Leagues[0];
            }

            if (Array.isArray(it.Children) && it.Children.length) {
                const found = this.findFirstLeague(it.Children);
                if (found) return found;
            }

            if (it.LeagueId || it.IdLeague || it.Id) {
                return it;
            }
        }
        return null;
    }


    selectLeague(leagueId: number) {
        console.log('selectLeague ->', leagueId);
    }
    // End leagues

    // Lines
    getSplitSchedule(body: any = {}) {
        const url = `${this.baseLines}${PostMethods.GET_LINES}`;
        const payload = { ...body };

        return this.api.apiPostMethod(url, payload).pipe(
            tap(res => console.log('[LinesService] raw response:', res)),
            catchError(err => {
                console.error('[LinesService] error', err);
                return of(null);
            }),
            shareReplay({ bufferSize: 1, refCount: false })
        );
    }

    ngOnDestroy() {
        if (this.subscription$) this.subscription$.unsubscribe();
    }
}
