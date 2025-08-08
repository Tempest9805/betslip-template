import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnDestroy, OnInit, inject, ViewChild } from '@angular/core';
import { interval, Subscription, take } from 'rxjs';
import { LinesService } from '../../../services/lines.service';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment';
import { GetMethods, PostMethods } from '../../../common/endpoints';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

import { CentralLinesContainerComponent } from '../../layouts/central-lines-container/central-lines-container.component';
import { BetsCartComponent } from '../../layouts/bets-cart/bets-cart.component';
import { SideBarComponent } from '../../layouts/side-bar/side-bar.component';


interface LineData {
  Description: string;
}
@Component({
  selector: 'app-sports',
  standalone: true,
  imports: [ CommonModule, FormsModule, TranslateModule, SideBarComponent, CentralLinesContainerComponent, BetsCartComponent],
  templateUrl: './sports.component.html',
  styleUrl: './sports.component.scss'
})
export class SportsComponent implements OnInit, OnDestroy {
  linesData: any[] = [];
  selectedLeagues: number[] = [];
  showLoader = false;
  // linesService = inject(LinesService);
  // translate = inject(TranslateService);

  private endTime!: number;
  private timer: any;
  rotNumber: string = '';
  teamName: string = '';
  linesFiltered: boolean = false;


  private subscription$: Subscription = new Subscription();

  apiService = inject(ApiService);

  ngOnInit(): void {

    const storedData = localStorage.getItem('licenseData');

  }

  getLines() {

    const storedData = sessionStorage.getItem('userData');

    const player = storedData ? JSON.parse(storedData) : '';

    // if (this.selectedLeagues.length > 0) {
    //   this.showLoader = true;
    //   const url = `${environment.linesApiUrl + PostMethods.GET_NEW_LINES}`;
    //   const requestBody = {
    //     IdPlayer: player.IdPlayer,
    //     LeagueList: this.selectedLeagues,
    //     NextHour: false,
    //     SiteId: 0
    //   };

    //   this.subscription$.add(
    //     this.apiService.apiPostMethod(url, requestBody).subscribe({
    //       next: (response: any) => {
    //         if (response) {
    //           this.linesData = response;
    //           this.showLoader = false;
    //           this.linesFiltered = false;
    //           this.resetCountdown();
    //         } else {
    //           this.resetCountdown();
    //           this.showLoader = false;
    //         }
    //       },
    //       error: (err: any) => {
    //         console.error('Error fetching data:', err);
    //       }
    //     })
    //   );
    // } else {
    //   this.linesData = [];
    // }
  }

  // getFilteredGames(serchValue: string, isRot: boolean = false) {
  //   this.showLoader = true;
  //   const url = `${environment.linesApiUrl + GetMethods.GET_FILTERED_GAMES}`;

  //   const params = {
  //     byRotation: isRot.toString(),
  //     searchValue: serchValue,
  //   };

  //   this.subscription$.add(
  //     this.apiService.apiGetMethodWithParams(url, params).subscribe({
  //       next: (response: any) => {
  //         if (response) {
  //           this.linesData = response;
  //           this.showLoader = false;
  //           this.linesFiltered = true;
  //         } else {
  //           this.showLoader = false;
  //         }
  //       },
  //       error: (err: any) => {
  //         console.error('Error fetching data:', err);
  //       }
  //     })
  //   );
  // }

  // filterGames(isRot: boolean = false) {
  //   if (isRot) {
  //     this.getFilteredGames(this.rotNumber, isRot);
  //   } else {
  //     this.getFilteredGames(this.teamName);
  //   }
  // }

  // searchClear(isRot: boolean = false) {
  //   if (isRot) {
  //     this.rotNumber = '';
  //   } else {
  //     this.teamName = '';
  //   }
  //   this.linesFiltered = false;
  // }

  // async loadSelectedLeagues() {
  //   this.subscription$.add(this.apiService.selectedLeagues
  //     .subscribe((resp) => {
  //       if (resp) {
  //         this.selectedLeagues = resp;
  //         this.getLines();
  //       }
  //     }));
  // }


  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }


  // showBetsCartModal() {
  //   this.betsCartModal.openModal();
  // }



  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
