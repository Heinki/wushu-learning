import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss',
})
export class ResourcesComponent {
  pdfFiles = [
    {
      name: 'WUSHU-SANDA-COMPETITION-RULES-JUDGING-METHODS-2024.pdf',
      path: 'assets/pdf/WUSHU-SANDA-COMPETITION-RULES-JUDGING-METHODS-2024.pdf',
    },
    {
      name: 'WUSHU-TAOLU-COMPETITION-RULES-AND-JUDGING-METHODS-2024.pdf',
      path: 'assets/pdf/WUSHU-TAOLU-COMPETITION-RULES-AND-JUDGING-METHODS-2024.pdf',
    },
  ];
}
