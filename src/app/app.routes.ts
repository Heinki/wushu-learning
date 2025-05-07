import { Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { TechniqueDetailComponent } from './components/technique-detail/technique-detail.component';
import { JudgingCriteriaComponent } from './components/judging-criteria/judging-criteria.component';
import { PracticeComponent } from './components/practice/practice.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { MistakesComponent } from './components/mistakes/mistakes.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'practice', component: PracticeComponent },
  { path: 'judging-criteria', component: JudgingCriteriaComponent },
  {
    path: 'judging-criteria/:techniqueId',
    component: TechniqueDetailComponent,
  },
  { path: 'mistakes', component: MistakesComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: '**', redirectTo: '' },
];
