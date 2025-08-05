import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { PostMethods } from '../../../common/endpoints';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-side-bar',
  imports: [ CommonModule, FormsModule,
    TranslateModule],
  standalone: true,
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent implements OnInit {

  subscription$: Subscription = new Subscription();
  apiService = inject(ApiService);

  oringalLeagues: any[] = [];
  allLeagues: any[] = [];
  selectedLeagues: number[] = [];
  tillData: any;
  featuresByLicense: any = null;
  searchLeague: string = '';
  isSelfService: boolean = false;

  ngOnInit(): void {

    const storedData = localStorage.getItem('licenseData');
    const licenseData = storedData ? JSON.parse(storedData) : '';
    this.isSelfService = licenseData.isSelfService || false;

    if (!this.isSelfService) {
      this.loadTillData();
    }
    this.loadSelectedLeagues();
    // this.getLeagues();
    this.loadFeaturesByLicense();
  }

  // getLeagues() {
  //   const storedData = sessionStorage.getItem('userData');

  //   const player = storedData ? JSON.parse(storedData) : '';

  //   const postData = {
  //     "WagerType": 0,
  //     "IdPlayer": player.IdPlayer,
  //     "IdLanguage": 0,
  //     "Sport": "",
  //     "Player": player.Player,
  //     "FilterTeaser": true
  //   };

  //   const url = `${environment.linesApiUrl + PostMethods.GET_ACTIVE_LEAGUES}`;
  //   this.subscription$.add(this.apiService.apiPostMethod(url, postData).subscribe({
  //     next: (result: any) => {
  //       if (result) {
  //         this.oringalLeagues = result;
  //         this.allLeagues = [...this.oringalLeagues];
  //         this.selectLeague(this.allLeagues[0].Leagues[0].IdLeague);
  //       }
  //     },
  //     error: (err: any) => {
  //     }
  //   }));
  // }

  filterLeagues(value: string): void {
    if (!value) {
      // Restaurar datos originales si no hay búsqueda
      this.allLeagues = [...this.oringalLeagues];
    } else {
      const searchTerm = value.toLowerCase();
      this.allLeagues = this.oringalLeagues
        .filter(sport => {
          // Filtrar deportes que coincidan O tengan ligas que coincidan
          return (
            sport.Sport.toLowerCase().includes(searchTerm) ||
            sport.Leagues.some((league: any) =>
              league.LeagueDescription.toLowerCase().includes(searchTerm)
            ))
        })
        .map(sport => {
          // Para cada deporte, filtrar solo sus ligas que coincidan
          const filteredLeagues = sport.Leagues.filter((league: any) =>
            league.LeagueDescription.toLowerCase().includes(searchTerm)
          );
          // Retornar el deporte con sus ligas filtradas (si el deporte coincide, mantener todas sus ligas)
          return {
            ...sport,
            Leagues: sport.Sport.toLowerCase().includes(searchTerm)
              ? sport.Leagues
              : filteredLeagues
          };
        });
    }
  }


  clearSearch() {
    this.searchLeague = '';
    this.allLeagues = [...this.oringalLeagues];
  }

  selectLeague(leagueId: number) {
    if (this.selectedLeagues.includes(leagueId)) {
      this.selectedLeagues = this.selectedLeagues.filter(id => id != leagueId);
    } else {
      this.selectedLeagues.push(leagueId);
    }
    this.apiService.SetSelectedLeagues(this.selectedLeagues);
  }

  async loadSelectedLeagues() {
    this.subscription$.add(this.apiService.selectedLeagues
      .subscribe((resp) => {
        if (resp) {
          this.selectedLeagues = resp;
        }
      }));
  }

  async loadFeaturesByLicense() {
    this.subscription$.add(this.apiService.licenceFeatures
      .subscribe((resp) => {
        if (resp) {
          this.featuresByLicense = resp;
        }
      }));
  }


  async loadTillData() {
    this.subscription$.add(this.apiService.tillData
      .subscribe((resp) => {
        if (resp) {
          this.tillData = resp;
        }
      }));
  }


  sportIconMap: { [key: string]: string } = {
    'bk-league-icon-color.png': 'fa-solid fa-basketball',
    'sc-league-icon-color.png': 'fa-solid fa-futbol',
    'tn-league-icon-color.png': 'fa-solid fa-baseball',
    'bb-league-icon-color.png': 'fa-solid fa-baseball-bat-ball',
    'hk-league-icon-color1.png': 'fa-solid fa-hockey-puck',
    'fb-league-icon-color.png': 'fa-solid fa-football',
    'gf-league-icon-color1.png': 'fa-solid fa-golf-ball-tee',
    'ra-league-icon-color.png': 'fa-solid fa-car-burst',
    'bx-league-icon-color.png': 'fa-solid fa-people-arrows',
    'gen-league-icon-color.png': 'fa-solid fa-medal',
    'rug-league-icon-color.png': 'fa-solid fa-football',
    '': 'fa-solid fa-clapperboard',

  };

  getSportIconClass(sportName: string): string {
    const normalized = sportName.trim().toLowerCase();
    for (const key in this.sportIconMap) {
      if (normalized.includes(key)) {
        return this.sportIconMap[key];
      }
    }
    return 'fa-solid fa-question';
  }


}
