
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private http = inject(HttpClient);
  private url = 'assets/data.json';

  private data$ = this.http.get<any>(this.url).pipe(
    map(d => this.normalize(d || {})),
    shareReplay({ bufferSize: 1, refCount: false }),
    catchError(() => of({}))
  );

  getCollection(key: string, sort = false) {
    return this.data$.pipe(
      map(data => {
        const arr = data?.[key] ?? [];
        return sort ? [...arr].sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0)) : arr;
      })
    );
  }
  getBrandLogo() { return this.data$.pipe(map(d => d?.brand ?? null)); }
  getHeaderItems() { return this.getCollection('headerItems', true); }
  getSubheaderItems() { return this.getCollectionExists(['subHeaderItems', 'subheaderItems']); }
  getOtherLinks() { return this.getCollection('otherLinks', true); }
  getEventsOfDay() { return this.getCollection('eventsOfDay', true); }
  getAll() { return this.data$; }
  
  getById(collectionKey: string, id: string) {
    return this.getCollection(collectionKey).pipe(map(items => (items || []).find((x: any) => x.id === id)));
  }

  private normalize(root: any) {
    const out = { ...root };
    const used = new Set<string>();

    const walk = (arr: any[], key: string, parents: string[] = []) =>
      arr.map((it: any, i: number) => {
        const item = { ...it };
        const id = item.id ?? this.genId(item, i, key, parents, used);
        item.id = id; used.add(id);
        for (const k of Object.keys(item)) if (Array.isArray(item[k])) item[k] = walk(item[k], k, parents.concat(id));
        return item;
      });

    for (const k of Object.keys(out)) if (Array.isArray(out[k])) out[k] = walk(out[k], k, []);
    return out;
  }

  private genId(it: any, idx: number, key: string, parents: string[], used: Set<string>) {
    const cand = it.route ?? it.label ?? it.sportName ?? it.leagueName ?? it.competitionName ?? it.eventId ?? it.name ?? it.title ?? it.home;
    if (cand) {
      const base = `${parents.length ? parents.join('-') + '-' : ''}${key}-${this.slug(String(cand))}`;
      return this.ensureUnique(base, used);
    }

    if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) {
      return this.ensureUnique((crypto as any).randomUUID(), used);
    }
    return this.ensureUnique(`${key}-${idx}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`, used);
  }

  private ensureUnique(base: string, used: Set<string>) {
    if (!used.has(base)) return base;
    let i = 1, cur = `${base}-${i}`;
    while (used.has(cur)) cur = `${base}-${++i}`;
    return cur;
  }

  private slug(s: string) {
    return s?.normalize?.('NFKD')?.replace(/[\u0300-\u036f]/g, '')?.toLowerCase()?.trim()?.replace(/[^a-z0-9]+/g, '-')?.replace(/(^-|-$)/g, '') ?? s;
  }

  private getCollectionExists(keys: string[], sort = true) {
    return this.data$.pipe(map(data => {
      const key = keys.find(k => Array.isArray(data?.[k])) ?? keys[0];
      const arr = data?.[key] ?? [];
      return sort ? [...arr].sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0)) : arr;
    }));
  }
}
