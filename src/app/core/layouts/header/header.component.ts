import { Component, inject, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SideBarComponent } from "../side-bar/side-bar.component";

import { RouterLink } from '@angular/router';

import { ApiService } from '../../../services/api.service';

import { CommonModule } from '@angular/common';
import { catchError, EMPTY, interval, Subscription, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GetMethods } from '../../../common/endpoints';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, TranslateModule],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent implements OnInit {


  _renderer = inject(Renderer2);
  apiService = inject(ApiService);
  authService = inject(AuthService);
  ngZone = inject(NgZone);
  translate = inject(TranslateService);
  username: string = '';
  intervalId: any;

  initalBalanceCheck: boolean = true;

  private subscription$: Subscription = new Subscription();

  tillBalanceData: any = null;
  tillBalance: number = 0;


  ngOnInit(): void {

    const userData = sessionStorage.getItem('userData');


    if (userData) {
      const user = JSON.parse(userData);
      this.username = user.Player;
    }

  }

  loadScript(src: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      const scriptId = src.split('/')[6];
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        resolve();
        return;
      }

      const script = this._renderer.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      script.id = src.split('/')[6];
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        reject(new Error(`Script load error for ${src}`));
      };
      this._renderer.appendChild(document.body, script);
    });
  }

  // end
  logout() {
    this.authService.logout();
  }


  loadSessionBets() {
    const storedBets = localStorage.getItem('betList');
    const bets = storedBets ? JSON.parse(storedBets) : [];



  }

  clearSessionData() {
    localStorage.removeItem('betList');

    localStorage.removeItem('storedAmount');
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }


}
