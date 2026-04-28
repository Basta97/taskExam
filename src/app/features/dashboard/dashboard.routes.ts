import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/dashboard-layout').then(
        (m) => m.DashboardLayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'diplomas',
        pathMatch: 'full',
      },
      {
        path: 'diplomas',
        loadComponent: () =>
          import('./pages/diplomas/diplomas').then((m) => m.Diplomas),
      },
      {
        path: 'diplomas/:diplomaId/exams',
        loadComponent: () =>
          import('./pages/exams/exams').then((m) => m.Exams),
      },
      {
        path: 'exams',
        loadComponent: () =>
          import('./pages/examlist/examlist').then((m) => m.Examlist),
      },
      {
        path: 'exams/:examId/play',
        loadComponent: () =>
          import('./pages/play/play').then((m) => m.Play),
      },
      {
        path: 'results/:submissionId',
        loadComponent: () =>
          import('./pages/results/results').then((m) => m.Results),
      },
      {
        path: 'account-settings',
        loadComponent: () =>
          import('./pages/account-settings/account-settings').then((m) => m.AccountSettingsComponent),
      },
    ],
  },
];
