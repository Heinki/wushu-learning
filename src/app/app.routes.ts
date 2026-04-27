import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/main-page/main-page.component').then(
        (m) => m.MainPageComponent
      ),
  },
  {
    path: 'practice',
    loadComponent: () =>
      import('./components/practice/practice.component').then(
        (m) => m.PracticeComponent
      ),
  },
  {
    path: 'sanda',
    loadComponent: () =>
      import('./components/sanda/sanda.component').then((m) => m.SandaComponent),
  },
  {
    path: 'judging-criteria',
    loadComponent: () =>
      import('./components/judging-criteria/judging-criteria.component').then(
        (m) => m.JudgingCriteriaComponent
      ),
  },
  {
    path: 'judging-criteria/:techniqueId',
    loadComponent: () =>
      import('./components/technique-detail/technique-detail.component').then(
        (m) => m.TechniqueDetailComponent
      ),
  },
  {
    path: 'mistakes',
    loadComponent: () =>
      import('./components/mistakes/mistakes.component').then(
        (m) => m.MistakesComponent
      ),
  },
  {
    path: 'resources',
    loadComponent: () =>
      import('./components/resources/resources.component').then(
        (m) => m.ResourcesComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
