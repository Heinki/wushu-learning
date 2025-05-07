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
    // Load mistakes from localStorage
    this.loadMistakes();
  }

  /**
   * Load mistakes from localStorage
   */
  loadMistakes(): void {
    try {
      const mistakesJson = localStorage.getItem('wushu-mistakes');
      this.mistakes = mistakesJson ? JSON.parse(mistakesJson) : [];

      // Sort mistakes by count (most frequent first)
      this.mistakes.sort((a, b) => b.count - a.count);

      console.log('Loaded mistakes:', this.mistakes);
    } catch (error) {
      console.error('Error loading mistakes:', error);
      this.mistakes = [];
    } finally {
      this.loading = false;
    }
  }

  /**
   * Navigate to technique details
   */
  navigateToTechnique(code: string): void {
    this.router.navigate(['/judging-criteria', code]);
  }

  /**
   * Group mistakes by category
   */
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

  /**
   * Clear all mistakes from localStorage
   */
  clearAllMistakes(): void {
    if (
      confirm(
        'Are you sure you want to clear all mistake data? This cannot be undone.'
      )
    ) {
      localStorage.removeItem('wushu-mistakes');
      this.mistakes = [];
    }
  }

  /**
   * Delete a single mistake
   */
  deleteMistake(mistake: MistakeItem): void {
    const index = this.mistakes.findIndex(
      (m) =>
        m.technique_code === mistake.technique_code &&
        m.question === mistake.question
    );

    if (index !== -1) {
      this.mistakes.splice(index, 1);
      localStorage.setItem('wushu-mistakes', JSON.stringify(this.mistakes));
    }
  }

  /**
   * Format deduction points for display
   */
  formatDeductionPoints(points: string[]): string {
    if (!points || points.length === 0) {
      return 'No specific deduction points.';
    }

    return points.join(', ');
  }
}
