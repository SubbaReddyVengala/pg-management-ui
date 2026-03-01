import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardStats } from '../models/report.model';
 
@Injectable({ providedIn: 'root' })
export class ReportService {
 
  private http = inject(HttpClient);
  private API  = environment.apiUrl;
 
  // GET /api/reports/dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(
      `${this.API}/api/reports/dashboard`
    );
  }
}
