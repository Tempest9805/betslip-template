import { Routes } from '@angular/router';
import { SportsComponent } from './sports/sports.component';
import { RacebookComponent } from './racebook/racebook.component';
import { PagesComponent } from './pages.component';
import { LiveComponent } from './live/live.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';


export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages.component').then(m => m.PagesComponent),
        children: [
            {
                path: '',
                redirectTo: 'sports',
                pathMatch: 'full'
            },
            {
                path: 'sports',
                loadComponent: () => import('./sports/sports.component').then(m => m.SportsComponent),
                title: 'Sports'
            },
            {
                path: 'racebook',
                loadComponent: () => import('./racebook/racebook.component').then(m => m.RacebookComponent),
                title: 'Racebook'
            },
            {
                path: 'live',
                loadComponent: () => import('./live/live.component').then(m => m.LiveComponent),
                title: 'Live'
            },
            {
                path: 'access-denied',
                loadComponent: () => import('./access-denied/access-denied.component').then(m => m.AccessDeniedComponent),
                title: 'Access denied'
            }
        ]
    }
];
