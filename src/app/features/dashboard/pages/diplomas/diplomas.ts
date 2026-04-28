import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { Diploma } from '../../../../shared/models/dashboard';

@Component({
  selector: 'app-diplomas',
  standalone: true,
  imports: [],
  templateUrl: './diplomas.html',
  styleUrl: './diplomas.css',
})
export class Diplomas implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);

  diplomas = signal<Diploma[]>([]);
  loading = signal(true);
  error = signal('');
  currentPage = signal(1);
  totalPages = signal(1);
  total = signal(0);

  ngOnInit() {
    this.loadDiplomas();
  }

  loadDiplomas() {
    this.loading.set(true);
    this.error.set('');
    this.dashboardService.getDiplomas(this.currentPage()).subscribe({
      next: (res: any) => {
        this.diplomas.set(res.payload.data);
        this.totalPages.set(res.payload.metadata.totalPages);
        this.total.set(res.payload.metadata.total);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set(err?.error?.message || 'Failed to load diplomas');
        this.loading.set(false);
      },
    });
  }

  goToExams(diplomaId: string) {
    this.router.navigate(['/dashboard/diplomas', diplomaId, 'exams']);
  }

  truncateDesc(desc: string): string {
    if (!desc) return '';
    const words = desc.split(' ');
    if (words.length <= 9) return desc;
    return words.slice(0, 9).join(' ') + '...';
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadDiplomas();
  }
}
