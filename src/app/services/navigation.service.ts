import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private http = inject(HttpClient);
  private readonly url = 'assets/data.json';

  private data$ = this.http.get<any>(this.url).pipe(
    map(d => this.normalize(d || {})),
    shareReplay({ bufferSize: 1, refCount: false }),
    catchError(() => of({}))
  );

  getCollection(key: string, sort = false): Observable<any[]> {
    return this.data$.pipe(
      map(data => {
        const arr = data[key] ?? [];
        return sort ? [...arr].sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0)) : arr;
      })
    );
  }

  getBrandLogo() { return this.data$.pipe(map(d => d?.brand ?? null)); }
  getHeaderItems() { return this.getCollection('headerItems', true); }
  getSubheaderItems() {
    return this.getCollectionExists(['subHeaderItems','subheaderItems']);
  }
  getOtherLinks() {
    return this.getCollection('otherLinks', true);
  }
  getEventsOfDay() {
    return this.getCollection('eventsOfDay', true);
  }

  getAll() { return this.data$; }

  getById(collectionKey: string, id: string) {
    return this.getCollection(collectionKey).pipe(map(items => (items || []).find((x: any) => x.id === id)));
  }


  private getCollectionExists(keys: string[], sort = true) {
    return this.data$.pipe(
      map(data => {
        const key = keys.find(k => Array.isArray(data[k])) ?? keys[0];
        const arr = data[key] ?? [];
        return sort ? [...arr].sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0)) : arr;
      })
    );
  }

  private normalize(obj: any) {
    const out: any = { ...obj };
    for (const k of Object.keys(out)) {
      if (Array.isArray(out[k])) {
        out[k] = out[k].map((it: any, i: number) => ({
          ...it,
          id: it.id ?? this.makeId(it, i, k)
        }));
      }
    }
    return out;
  }

  private makeId(it: any, i: number, key: string) {
    if (it?.route) return `id-${this.slug(it.route)}`;
    if (it?.label) return `id-${this.slug(it.label)}`;
    return `${key}-${i}`;
  }

  private slug(s: string) {
    return String(s)
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
