import { Component, Inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StanceService } from '../../services/stance.service';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  standalone: true,
})
export class NavigationComponent {
  isCollapsed = false;
  showStances = false;
  stances: any[] = [];

  constructor(@Inject(StanceService) private stanceService: StanceService) {}

  toggleNavigation(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleStances(): void {
    this.showStances = !this.showStances;
    if (this.showStances && this.stances.length === 0) {
      this.stanceService.getStances().subscribe((data) => {
        this.stances = data;
      });
    }
  }
}
