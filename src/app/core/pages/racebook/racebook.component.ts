import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { GetMethods, PostMethods } from '../../../common/endpoints';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-racebook',
  standalone: true,
  imports: [TranslateModule, CommonModule, FormsModule],
  templateUrl: './racebook.component.html',
  styleUrl: './racebook.component.scss'
})
export class RacebookComponent implements OnInit {

  subscription$: Subscription = new Subscription();
  apiService = inject(ApiService);
  translate = inject(TranslateService);
  toast = inject(ToastrService);
  sanitizer = inject(DomSanitizer);

  currentDate: Date = new Date();
  player: any = null;
  tillData: any;
  barCode: any;
  storedPlayer: any;
  ticketData: any;
  username: string = '';
  password: string = '';
  safeHorsesUrl: SafeResourceUrl | undefined;

  winTax: number = 0;
  salesTax: number = 0;
  pleTax: number = 0;

  loading = false;

  supervisorPassword: string = '';
  reprint: boolean = false;

  ngOnInit(): void {
    const storedData = sessionStorage.getItem('userData');
    this.storedPlayer = storedData ? JSON.parse(storedData) : '';
    this.loadTillData();

    // Sanitiza la URL del iframe
    const url = `//HorsesRedirect.betimages.com/horsesredirect.aspx?siteid=Jazz&DSSWP=${this.storedPlayer.Player}&NGL=${this.storedPlayer.Password}&XFP=DefaultWhite`;
    this.safeHorsesUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  async loadTillData() {
    this.subscription$.add(this.apiService.tillData
      .subscribe((resp) => {
        if (resp) {
          this.tillData = resp;
        }
      }));
  }



}
