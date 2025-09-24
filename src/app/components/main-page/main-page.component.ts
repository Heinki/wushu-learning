import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../card/card.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CardComponent, RouterLink, TranslateModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {}
