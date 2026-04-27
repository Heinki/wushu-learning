import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardComponent } from '../card/card.component';
import { MistakeItem } from '../../interfaces/question';
import { TranslateModule } from '@ngx-translate/core';
import { MistakeStorageService } from '../../services/mistake-storage.service';

@Component({
  selector: 'app-mistakes',
  standalone: true,
  imports: [CommonModule, CardComponent, TranslateModule],
  templateUrl: './mistakes.component.html',
  styleUrl: './mistakes.component.scss',
})
export class MistakesComponent implements OnInit {
  mistakes: MistakeItem[] = [];
  loading = true;
  objectKeys = Object.keys;

  constructor(
    private router: Router,
    private mistakeStorage: MistakeStorageService
  ) {}

  ngOnInit(): void {
    this.loadMistakes();
  }

  loadMistakes(): void {
    try {
      this.mistakes = this.mistakeStorage.getAll();
      this.mistakes.sort((a, b) => b.count - a.count);
    } catch (error) {
      this.mistakes = [];
    } finally {
      this.loading = false;
    }
  }

  navigateToTechnique(code: string): void {
    this.router.navigate(['/judging-criteria', code]);
  }

  get groupedMistakes(): { [category: string]: MistakeItem[] } {
    const grouped: { [category: string]: MistakeItem[] } = {};

    this.mistakes.forEach((mistake) => {
      const category = mistake.category || 'Uncategorized';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(mistake);
    });

    return grouped;
  }

  clearAllMistakes(): void {
    this.mistakeStorage.clear();
    this.mistakes = [];
  }
}
