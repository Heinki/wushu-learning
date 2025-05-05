import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CardComponent } from '../card/card.component';
import { switchMap } from 'rxjs';
import { TechniqueService, Technique } from '../../services/technique.service';

@Component({
  selector: 'app-technique-detail',
  standalone: true,
  imports: [CommonModule, CardComponent, RouterLink],
  templateUrl: './technique-detail.component.html',
  styleUrl: './technique-detail.component.scss',
})
export class TechniqueDetailComponent implements OnInit {
  technique: Technique | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private techniqueService: TechniqueService
  ) {}

  /**
   * Navigate back to judging criteria
   */
  navigateToJudgingCriteria(): void {
    this.router.navigate(['/judging-criteria']);
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
