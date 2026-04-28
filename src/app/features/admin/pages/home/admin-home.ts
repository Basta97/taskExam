import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { AdminService } from '../../../../shared/services/admin.service';
import { AdminStats } from '../../../../shared/models/admin.models';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css',
})
export class AdminHomeComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  stats = signal<AdminStats>({
    totalUsers: 0,
    totalExams: 0,
    totalDiplomas: 0,
    totalSubmissions: 0,
    averageScore: 0,
  });

  ngOnInit() {
    this.adminService.getStats().subscribe({
      next: (res: any) => {
        const payload = res?.payload || res;
        if (payload) {
          this.stats.set(payload);
        }
      },
    });
  }
}
