import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
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

  // ── Mobile: parent tells sidebar if it is open ──
  @Input() isOpen = false;

  // ── Mobile: sidebar tells parent to close (when nav link clicked) ──
  @Output() closed = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '⬛' },
    { label: 'Rooms',     path: '/rooms',     icon: '🏠' },
    { label: 'Tenants',   path: '/tenants',   icon: '👤' },
    { label: 'Payments',  path: '/payments',  icon: '💳' },
    { label: 'Reports',   path: '/reports',   icon: '📊' },
  ];

  // Called when any nav link is clicked — closes sidebar on mobile
  onNavClick(): void {
    this.closed.emit();
  }

  logout(): void {
    this.authService.logout();
  }
}