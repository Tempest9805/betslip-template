import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-bets-cart',
  imports: [],
  standalone: true,
  templateUrl: './bets-cart.component.html',
  styleUrl: './bets-cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetsCartComponent { }
