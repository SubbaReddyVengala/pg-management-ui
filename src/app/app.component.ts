import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class AppComponent implements OnInit {
 
  private authService = inject(AuthService);
 
  ngOnInit(): void {
    // On every app startup — if token exists, restore the user session
    if (this.authService.isLoggedIn()) {
      this.authService.restoreSession().subscribe({
        error: () => {
          // restoreSession already calls logout() on error
          // nothing extra needed here
        }
      });
    }
  }
}
