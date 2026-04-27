import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sanda',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './sanda.component.html',
  styleUrl: './sanda.component.scss',
})
export class SandaComponent {
  quickFacts = [
    'rounds',
    'roundDuration',
    'rest',
    'platform',
    'validAreas',
    'prohibitedAreas',
  ];

  scoringRules = ['twoPoints', 'onePoint', 'noScore', 'fouls'];

  pdfPath = 'assets/pdf/WUSHU-SANDA-COMPETITION-RULES-JUDGING-METHODS-2024.pdf';
}
