import { Component, inject, NgZone, OnInit } from '@angular/core';

import { ApiService } from '../../../services/api.service';

import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule, TranslateModule, ThemeToggleComponent],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent implements OnInit {

  apiService = inject(ApiService);
  authService = inject(AuthService);
  ngZone = inject(NgZone);
  translate = inject(TranslateService);
  username: string = '';

  readonly theme = inject(ThemeService);
  private subscription$: Subscription = new Subscription();

  ngOnInit(): void {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      this.username = user.Player;
    }
  }

  logout() {
    this.authService.logout();
  }

  clearSessionData() {
    localStorage.removeItem('betList');
    localStorage.removeItem('storedAmount');
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }


}
