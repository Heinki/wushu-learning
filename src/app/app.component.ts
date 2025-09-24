import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';
import { TranslateService } from '@ngx-translate/core';
import { TechniqueService } from './services/technique.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent {
  title = 'Wushu Learning';
  private translate = inject(TranslateService);
  private techniqueService = inject(TechniqueService);

  constructor() {
    const stored = localStorage.getItem('lang');
    const lang = stored || 'en';
    this.translate.addLangs(['en', 'zh']);
    this.translate.setFallbackLang('en');
    this.translate.use(lang);

    // Clear technique cache when language changes
    this.translate.onLangChange.subscribe(() => {
      this.techniqueService.clearCache();
    });
  }
}
