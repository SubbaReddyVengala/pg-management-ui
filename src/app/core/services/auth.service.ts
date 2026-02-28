import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, User } from '../models/user.model';
 
@Injectable({ providedIn: 'root' })
export class AuthService {
 
  private http   = inject(HttpClient);
  private router = inject(Router);
 
  private readonly TOKEN_KEY = 'pg_token';
  private readonly API       = environment.apiUrl;
 
  // BehaviorSubject holds the current user.
  // null  = not logged in
  // User  = logged in
  // Any component can subscribe to currentUser$ to react to changes.
  private currentUserSubject = new BehaviorSubject<User | null>(
    this.getUserFromStorage()
  );
  currentUser$ = this.currentUserSubject.asObservable();
 
  // ── Login ─────────────────────────────────────────────
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API}/api/auth/login`, credentials)
      .pipe(
        tap(response => {
          // Save token to localStorage
          localStorage.setItem(this.TOKEN_KEY, response.accessToken);
 
          // Update the current user in memory
          const user: User = {
            userId: String(response.userId),
            email:  response.email,
            role:   response.role as 'ADMIN' | 'TENANT',
          };
          this.currentUserSubject.next(user);
        }),
        catchError(err => {
          // Re-throw so the login component can show the error message
          return throwError(() => err);
        })
      );
  }
 
  // ── Logout ────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
 
  // ── Get current user from API (called on app startup) ─
  // Used to restore session after page refresh.
  // Token is still in localStorage but user object is gone from memory.
  restoreSession(): Observable<User> {
    return this.http
      .get<User>(`${this.API}/api/auth/me`)
      .pipe(
        tap(user => this.currentUserSubject.next(user)),
        catchError(err => {
          // Token expired or invalid — force logout
          this.logout();
          return throwError(() => err);
        })
      );
  }
 
  // ── Refresh token ─────────────────────────────────────
  refreshToken(): Observable<{ accessToken: string }> {
    return this.http
      .post<{ accessToken: string }>(
        `${this.API}/api/auth/refresh`, {})
      .pipe(
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.accessToken);
        })
      );
  }
 
  // ── Helpers ───────────────────────────────────────────
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
 
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
 
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
 
  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'ADMIN';
  }
 
  // ── Private: restore user object from token on startup ─
  private getUserFromStorage(): User | null {
  const token = localStorage.getItem(this.TOKEN_KEY);
  if (!token) return null;

  try {
    // JWT middle part (payload) contains email, role, expiry — decode it instantly
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));

    // Check token not expired
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem(this.TOKEN_KEY);
      return null;
    }

    return {
      userId: String(decoded.userId ?? decoded.sub),
      email:  decoded.email  ?? decoded.sub,
      role:   decoded.role as 'ADMIN' | 'TENANT',
    };
  } catch {
    localStorage.removeItem(this.TOKEN_KEY);
    return null;
  }
}
}
