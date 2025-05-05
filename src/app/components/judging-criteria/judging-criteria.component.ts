import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CardComponent } from '../card/card.component';
import { TechniqueService, Technique } from '../../services/technique.service';

@Component({
  selector: 'app-judging-criteria',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './judging-criteria.component.html',
  styleUrl: './judging-criteria.component.scss',
})
export class JudgingCriteriaComponent implements OnInit {
  techniques: Technique[] = [];
  loading = true;
  error = false;

  constructor(
    private router: Router,
    private techniqueService: TechniqueService
  ) {}

  ngOnInit(): void {
    // Load all techniques
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

  /**
   * Navigate to a specific technique by code
   * @param code The technique code
   */
  navigateToTechnique(code: string): void {
    this.router.navigate(['/judging-criteria', code]);
  }

  /**
   * Group techniques by category
   */
  get groupedTechniques(): { [category: string]: Technique[] } {
    const grouped: { [category: string]: Technique[] } = {};

    this.techniques.forEach((technique) => {
      if (!grouped[technique.category]) {
        grouped[technique.category] = [];
      }
      grouped[technique.category].push(technique);
    });

    return grouped;
  }

  /**
   * Helper method to get object keys for use in template
   */
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
