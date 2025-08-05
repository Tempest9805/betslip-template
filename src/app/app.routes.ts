import { Routes } from '@angular/router';
import { LoginComponent } from './core/pages/login/login.component';
import { NotFoundComponent } from './core/pages/not-found/not-found.component';


export const routes: Routes = [

    {
        path: '',
        loadChildren: () => import('./core/pages/pages.routes').then(c => c.routes),
        title: 'DashBoard'
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./core/pages/login/login.component').then(m => m.LoginComponent),
        title: 'Login'
    },
    {
        path: '**',
        loadComponent: () =>
            import('./core/pages/not-found/not-found.component').then(m => m.NotFoundComponent),
        title: '404 - Not Found'
    }
];