import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../libs/auth/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayoutComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  sidebarExpanded = signal(true);
  userMenuOpen = signal(false);

  userName = computed(() => {
    const user = this.authService.currentUser();
    return user ? `${user.firstName} ${user.lastName}` : 'User';
  });

  userEmail = computed(() => this.authService.currentUser()?.email || 'user-email@example.com');

  userInitial = computed(() => {
    const user = this.authService.currentUser();
    return user ? user.firstName.charAt(0).toUpperCase() : 'U';
  });

  toggleSidebar() {
    this.sidebarExpanded.update((v) => !v);
  }

  toggleUserMenu() {
    this.userMenuOpen.update((v) => !v);
  }

  goToDashboard() {
    this.userMenuOpen.set(false);
    this.router.navigate(['/dashboard/diplomas']);
  }

  goToAccount() {
    this.userMenuOpen.set(false);
    this.router.navigate(['/dashboard/account-settings']);
  }

  logout() {
    this.userMenuOpen.set(false);
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
