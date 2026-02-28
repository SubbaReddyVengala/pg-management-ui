import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
 
interface NavItem {
  label: string;
  path: string;
  icon: string;
  adminOnly?: boolean;
}
 
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
 
  authService = inject(AuthService);
 
  // currentUser$ is an Observable — template uses async pipe to subscribe
  currentUser$ = this.authService.currentUser$;
 
  navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '⬛' },
    { label: 'Rooms',     path: '/rooms',     icon: '🏠' },
    { label: 'Tenants',   path: '/tenants',   icon: '👤' },
    { label: 'Payments',  path: '/payments',  icon: '💳' },
    { label: 'Reports',   path: '/reports',   icon: '📊' },
  ];
 
  logout(): void {
    this.authService.logout();
  }
}
