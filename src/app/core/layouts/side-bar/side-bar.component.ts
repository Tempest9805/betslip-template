import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { NavigationService } from '../../../services/navigation.service';
import { LinesService } from '../../../services/lines.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [ CommonModule, FormsModule, TranslateModule, RouterModule ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent implements OnInit {
  private nav = inject(NavigationService);
  private lines = inject(LinesService);

  eventsOfDay$ = this.nav.getCollection('eventsOfDay', true);
  otherLinks$ = this.nav.getCollection('otherLinks', true);
  subHeader$ = this.nav.getSubheaderItems();

  sports$!: Observable<any[]>;

  ngOnInit(): void {
    const stored = sessionStorage.getItem('userData');
  const player = stored ? JSON.parse(stored) : null;

  const body = {
    Gmt: -100,
    NextHour: false,
    LiveWager: false,
    Ip: '170.81.34.2',
    SiteId: 1,
    IdPlayer: player?.IdPlayer ?? 259818,
    LeagueList: [40,82,269,385,644,791,2037,2035,2374], 
    SourceDb: 0
  };

  this.lines.getSplitSchedule(body).subscribe(res => {
    console.log('API response recibido en componente:', res);
  });
  }

  trackById(_: number, item: any) {
    return item?.id ?? item?.leagueId ?? item?.competitionId ?? _;
  }

  isExternal(route?: string): boolean {
    return !!route && (route.startsWith('http://') || route.startsWith('https://') || route.startsWith('//'));
  }
}
