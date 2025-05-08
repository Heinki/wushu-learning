import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardComponent } from '../card/card.component';
import { MistakeItem } from '../../interfaces/question';

@Component({
  selector: 'app-mistakes',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './mistakes.component.html',
  styleUrl: './mistakes.component.scss',
})
export class MistakesComponent implements OnInit {
  mistakes: MistakeItem[] = [];
  loading = true;
  objectKeys = Object.keys;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMistakes();
  }

  loadMistakes(): void {
    try {
      const mistakesJson = localStorage.getItem('wushu-mistakes');
      this.mistakes = mistakesJson ? JSON.parse(mistakesJson) : [];

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
    localStorage.removeItem('wushu-mistakes');
    this.mistakes = [];
  }
}
