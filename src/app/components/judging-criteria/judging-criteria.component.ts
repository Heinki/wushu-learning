import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardComponent } from '../card/card.component';
import { TechniqueService } from '../../services/technique.service';
import { TechniqueQuestionData } from '../../interfaces/question';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-judging-criteria',
  standalone: true,
  imports: [CommonModule, CardComponent, TranslateModule],
  templateUrl: './judging-criteria.component.html',
  styleUrl: './judging-criteria.component.scss',
})
export class JudgingCriteriaComponent implements OnInit {
  techniques: TechniqueQuestionData[] = [];
  loading = true;
  error = false;
  openCategories: Set<string> = new Set();

  constructor(
    private router: Router,
    private techniqueService: TechniqueService
  ) {}

  ngOnInit(): void {
    this.techniqueService.getAllTechniques().subscribe({
      next: (techniques) => {
        this.techniques = techniques;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      },
    });
  }

  navigateToTechnique(code: string): void {
    this.router.navigate(['/judging-criteria', code]);
  }

  openAllCategories(): void {
    const categories = Object.keys(this.groupedTechniques);
    categories.forEach(category => {
      this.openCategories.add(category);
    });
  }

  closeAllCategories(): void {
    this.openCategories.clear();
  }

  toggleCategory(category: string): void {
    if (this.openCategories.has(category)) {
      this.openCategories.delete(category);
    } else {
      this.openCategories.add(category);
    }
  }

  isCategoryOpen(category: string): boolean {
    return this.openCategories.has(category);
  }

  get groupedTechniques(): { [category: string]: TechniqueQuestionData[] } {
    const grouped: { [category: string]: TechniqueQuestionData[] } = {};

    this.techniques.forEach((technique) => {
      if (!grouped[technique.category]) {
        grouped[technique.category] = [];
      }
      grouped[technique.category].push(technique);
    });

    return grouped;
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
