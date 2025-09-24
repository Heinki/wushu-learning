import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, CommonModule, TranslateModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  standalone: true,
})
export class NavigationComponent {
  isCollapsed = false;
  showStances = false;
  private translate = inject(TranslateService);

  get currentLang(): string {
    return (
      this.translate.getCurrentLang() ||
      this.translate.getFallbackLang() ||
      'en'
    );
  }

  changeLang(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  toggleNavigation(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
