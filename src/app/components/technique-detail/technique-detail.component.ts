import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from '../card/card.component';
import { switchMap } from 'rxjs';
import { TechniqueService } from '../../services/technique.service';
import { TechniqueQuestionData } from '../../interfaces/question';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-technique-detail',
  standalone: true,
  imports: [CommonModule, CardComponent, TranslateModule],
  templateUrl: './technique-detail.component.html',
  styleUrl: './technique-detail.component.scss',
})
export class TechniqueDetailComponent implements OnInit {
  technique: TechniqueQuestionData | null = null;
  loading = true;
  error = false;
  activeIndex: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private techniqueService: TechniqueService
  ) {}

  navigateToJudgingCriteria(): void {
    this.router.navigate(['/judging-criteria']);
  }

  toggleAccordion(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const techniqueId = params.get('techniqueId');
          if (!techniqueId) {
            return Promise.resolve(null);
          }
          return this.techniqueService.getTechniqueByCode(techniqueId);
        })
      )
      .subscribe({
        next: (technique) => {
          this.loading = false;
          if (technique) {
            this.technique = technique;
          } else {
            this.error = true;
            this.router.navigate(['/practice']);
          }
        },
        error: () => {
          this.loading = false;
          this.error = true;
        },
      });
  }
}
