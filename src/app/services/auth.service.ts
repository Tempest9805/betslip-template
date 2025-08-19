import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { updateSessionStorageForGuard } from '../common/methods';
import { LinesService } from './lines.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiService = inject(ApiService);
  linesService = inject(LinesService);
  route = inject(Router);

  logout() {
    updateSessionStorageForGuard(false);
    sessionStorage.clear();

    this.route.navigate(['/login']);
  }




}