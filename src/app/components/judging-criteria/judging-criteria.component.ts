import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardComponent } from '../card/card.component';
import { TechniqueService } from '../../services/technique.service';
import { TechniqueQuestionData } from '../../interfaces/question';

@Component({
  selector: 'app-judging-criteria',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './judging-criteria.component.html',
  styleUrl: './judging-criteria.component.scss',
})
export class JudgingCriteriaComponent implements OnInit {
  techniques: TechniqueQuestionData[] = [];
  loading = true;
  error = false;

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
