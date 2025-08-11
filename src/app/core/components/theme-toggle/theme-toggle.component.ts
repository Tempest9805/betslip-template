import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'theme-toggle',
  imports: [],
  standalone: true,
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent { 
  readonly theme = inject(ThemeService);

  onToggle(e: Event) {
    this.theme.toggle();
  }
}
