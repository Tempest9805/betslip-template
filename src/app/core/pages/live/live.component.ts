import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment';
import { GetMethods, PostMethods } from '../../../common/endpoints';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-live',
  standalone: true,
  imports: [TranslateModule, CommonModule, FormsModule],
  templateUrl: './live.component.html',
  styleUrl: './live.component.scss'
})
export class LiveComponent {

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
  safeLiveUrl: SafeResourceUrl | undefined;
  JAZZ_LOGIN_TOKEN = "+KgIk.s#uk4yXj~~.3";

  winTax: number = 0;
  salesTax: number = 0;
  pleTax: number = 0;

  loading = false;

  password: string = '';
  reprint: boolean = false;



  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const storedData = sessionStorage.getItem('userData');
    this.storedPlayer = storedData ? JSON.parse(storedData) : '';

    const currentTime: string = new Date().toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(' ', 'T').replace(/-/g, '-').replace('T', ' ');

  }


}
