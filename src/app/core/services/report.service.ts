import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardStats, OccupancyReport,
         RevenueReport, TenantDuesReport } from '../models/report.model';
 
@Injectable({ providedIn: 'root' })
export class ReportService {
 
  private http = inject(HttpClient);
  private API  = environment.apiUrl;
 
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API}/api/reports/dashboard`);
  }
 
  // Occupancy report (floor breakdown)
  getOccupancyReport(): Observable<OccupancyReport> {
    return this.http.get<OccupancyReport>(`${this.API}/api/reports/occupancy`);
  }
 
  // Revenue report with optional month/year filter
  getRevenueReport(month: number, year: number): Observable<RevenueReport> {
    const params = new HttpParams()
      .set('month', month.toString())
      .set('year',  year.toString());
    return this.http.get<RevenueReport>(
      `${this.API}/api/reports/revenue`, { params });
  }
 
  //Tenant dues / defaulters report
  getTenantDuesReport(): Observable<TenantDuesReport> {
    return this.http.get<TenantDuesReport>(`${this.API}/api/reports/dues`);
  }
}
