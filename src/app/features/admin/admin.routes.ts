/**
 * Admin console under `/admin/*`; gated by `adminGuard` (auth + admin role).
 */
import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/admin-layout').then((m) => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/admin-home').then((m) => m.AdminHomeComponent),
      },
      {
        path: 'diplomas',
        loadComponent: () =>
          import('./pages/diplomas/admin-diplomas').then((m) => m.AdminDiplomasComponent),
      },
      {
        path: 'exams',
        loadComponent: () =>
          import('./pages/exams/admin-exams').then((m) => m.AdminExamsComponent),
      },
      {
        path: 'exams/:examId/questions',
        loadComponent: () =>
          import('./pages/questions/admin-questions').then((m) => m.AdminQuestionsComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users/admin-users').then((m) => m.AdminUsersComponent),
      },
      {
        path: 'audit',
        loadComponent: () =>
          import('./pages/audit/admin-audit').then((m) => m.AdminAuditComponent),
      },
    ],
  },
];
