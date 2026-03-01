import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import { ReportService } from '../../core/services/report.service';
import { DashboardStats } from '../../core/models/report.model';
import { StatCardComponent } from './stat-card/stat-card.component';
 
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatCardComponent, CurrencyPipe, DecimalPipe, NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
 
  private reportService = inject(ReportService);
  private cdr           = inject(ChangeDetectorRef); 
  // State variables
  stats: DashboardStats | null = null;
  isLoading = true;
  errorMsg  = '';
 
  // Current month and year for display
  currentMonth = new Date().toLocaleString('default', { month: 'long' });
  currentYear  = new Date().getFullYear();
 
  ngOnInit(): void {
    this.loadDashboard();
  }
 
  loadDashboard(): void {
    this.isLoading = true;
    this.errorMsg  = '';
 
    this.reportService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats     = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg  = 'Failed to load dashboard data. Please try again.';
        this.cdr.detectChanges();
        console.error('Dashboard error:', err);
      }
    });
  }
 
  // Format currency in Indian Rupees
  formatCurrency(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN');
  }
 
  // Format occupancy rate
  formatRate(rate: number): string {
    return rate.toFixed(1) + '%';
  }
}
