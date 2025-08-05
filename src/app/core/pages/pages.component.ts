import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../layouts/header/header.component';
import { SideBarComponent } from '../layouts/side-bar/side-bar.component';
import { FooterComponent } from '../layouts/footer/footer.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, FooterComponent, TranslateModule],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss',
  providers: [TranslateService]
})
export class PagesComponent implements OnInit{
  ngOnInit(): void {}
}
