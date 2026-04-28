import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../../../shared/services/admin.service';
import { AuditLog } from '../../../../shared/models/admin.models';

@Component({
  selector: 'app-admin-audit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-audit.html',
  styleUrl: './admin-audit.css',
})
export class AdminAuditComponent {
  private readonly adminService = inject(AdminService);

  logs = signal<AuditLog[]>([]);
  loading = false;
  totalPages = 0;
  currentPage = 1;

  constructor() {
    this.loadLogs();
  }

  loadLogs(page: number = 1) {
    this.loading = true;
    this.currentPage = page;
    this.adminService.getAuditLogs(page, 20).subscribe({
      next: (res: any) => {
        const payload = res?.payload || res;
        this.logs.set(payload?.data || []);
        this.totalPages = payload?.metadata?.totalPages || 1;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }
}
