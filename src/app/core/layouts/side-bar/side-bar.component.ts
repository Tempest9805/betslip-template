import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { PostMethods } from '../../../common/endpoints';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationService } from '../../../services/navigation.service';


@Component({
  selector: 'app-side-bar',
  imports: [ CommonModule, FormsModule,
    TranslateModule, RouterModule],
  standalone: true,
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {

  private nav = inject(NavigationService);

  sports$: Observable<any[]> = this.nav.getCollection('sportsCategories', true);
  otherLinks$ = this.nav.getCollection('otherLinks', true);
  subHeader$ = this.nav.getSubheaderItems();
  eventsOfDay$ = this.nav.getEventsOfDay()
  
  trackById(_: number, item: any) {
    return item?.id ?? item?.sportId ?? item?.leagueId ?? item?.competitionId ?? item?.route ?? item?.title ?? _;
  }

  isExternal(route?: string): boolean {
    return !!route && (route.startsWith('http://') || route.startsWith('https://') || route.startsWith('//'));
  }

}
