import { Routes } from '@angular/router';
 
export const routes: Routes = [
 
  // Default route — redirect empty URL to dashboard
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
 
  // Login page — public, no guard needed
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },
 
  // Protected routes — wrapped inside the main layout shell
  // MainLayoutComponent provides the sidebar + top bar
  // Child routes appear INSIDE MainLayoutComponent's router-outlet
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component')
        .then(m => m.MainLayoutComponent),
    // canActivate: [authGuard],    // <- uncomment in Phase 2
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'rooms',
        loadComponent: () =>
          import('./features/rooms/rooms.component')
            .then(m => m.RoomsComponent)
      },
      {
        path: 'tenants',
        loadComponent: () =>
          import('./features/tenants/tenants.component')
            .then(m => m.TenantsComponent)
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./features/payments/payments.component')
            .then(m => m.PaymentsComponent)
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/reports.component')
            .then(m => m.ReportsComponent)
      },
    ]
  },
 
  // Wildcard — any unknown URL goes to dashboard
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
