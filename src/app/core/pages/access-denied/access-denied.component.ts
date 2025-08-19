import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.scss'
})
export class AccessDeniedComponent implements OnInit {

  apiService = inject(ApiService);
  router = inject(Router);
  features: any = null;
  translate = inject(TranslateService);


  ngOnInit(): void {
    
  }

  backToStart() {
    if (this.features.EnableSports) {
      this.router.navigate(['/']);
    } else if (this.features.EnableHorses) {
      this.router.navigate(['/racebook']);
    } else {
      this.router.navigate(['/no-products']);
    }
  }



}
