import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'dashboard/diplomas/:diplomaId/exams',
    renderMode: RenderMode.Server,
  },
  {
    path: 'dashboard/exams/:examId/play',
    renderMode: RenderMode.Server,
  },
  {
    path: 'dashboard/results/:submissionId',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/exams/:examId/questions',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
