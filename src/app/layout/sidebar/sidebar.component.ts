import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor } from '@angular/common';
 
interface NavItem {
  label: string;
  path: string;
  icon: string;
}
 
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
 
  navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '⬛' },
    { label: 'Rooms',     path: '/rooms',     icon: '🏠' },
    { label: 'Tenants',   path: '/tenants',   icon: '👤' },
    { label: 'Payments',  path: '/payments',  icon: '💳' },
    { label: 'Reports',   path: '/reports',   icon: '📊' },
  ];
 
  onLogout() {
    // Phase 2 will implement this properly
    localStorage.clear();
    window.location.href = '/login';
  }
}
