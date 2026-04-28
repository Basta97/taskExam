import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../libs/auth/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayoutComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  sidebarExpanded = signal(true);
  userMenuOpen = signal(false);

  userName = computed(() => {
    const user = this.authService.currentUser();
    return user ? `${user.firstName} ${user.lastName}` : 'Admin';
  });

  userInitial = computed(() => {
    const user = this.authService.currentUser();
    return user ? user.firstName.charAt(0).toUpperCase() : 'A';
  });

  toggleSidebar() {
    this.sidebarExpanded.update((v) => !v);
  }

  toggleUserMenu() {
    this.userMenuOpen.update((v) => !v);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
