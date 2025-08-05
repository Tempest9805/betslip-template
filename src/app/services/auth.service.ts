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
    this.apiService.SetLicenceFeatures(null);
    sessionStorage.clear();
    this.linesService.removeAllBets();
    localStorage.removeItem('betList');

    localStorage.removeItem('storedAmount');

    this.apiService.SetSessionAmount(0);

    this.route.navigate(['/login']);
  }




}