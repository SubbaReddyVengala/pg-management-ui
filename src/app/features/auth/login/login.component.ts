import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup,
         Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
 
  private fb          = inject(FormBuilder);
  private authService = inject(AuthService);
  private router      = inject(Router);
  private cdr         = inject(ChangeDetectorRef);
  loginForm!: FormGroup;
  isLoading  = false;
  errorMsg   = '';
 
  ngOnInit(): void {
    // If already logged in — skip login page
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return;
    }
 
    // Build the form with validation rules
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
 
  // Shortcut to access form controls in template
  get email()    { return this.loginForm.get('email')!; }
  get password() { return this.loginForm.get('password')!; }
 
  onSubmit(): void {
    // If form is invalid — mark all fields as touched to show errors
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
 
    this.isLoading = true;
    this.errorMsg  = '';
 
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        // Login success — navigate to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;

      // Add this console.log temporarily to see what err contains
  
      if (err.error && typeof err.error === 'object' && err.error.message) {
        this.errorMsg = err.error.message;
      } else if (err.error && typeof err.error === 'string') {
        this.errorMsg = err.error;
      } else if (err.status === 401) {
        this.errorMsg = 'Invalid email or password.';
      } else {
        this.errorMsg = 'Login failed. Please check your connection.';
      }
      this.cdr.detectChanges();
        }
    });
  }
}
