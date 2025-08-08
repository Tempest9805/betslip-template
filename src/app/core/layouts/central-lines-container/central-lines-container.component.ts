import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'central-lines-container',
  imports: [],
  standalone: true,
  templateUrl: './central-lines-container.component.html',
  styleUrl: './central-lines-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CentralLinesContainerComponent { }
