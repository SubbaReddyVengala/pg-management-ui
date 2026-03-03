import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../core/services/report.service';
import { OccupancyReport, RevenueReport,
         TenantDuesReport, MONTH_NAMES } from '../../core/models/report.model';
 
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
 
  private reportService = inject(ReportService);
  private cdr           = inject(ChangeDetectorRef);
 
  // Active tab
  activeTab: 'occupancy' | 'revenue' | 'dues' = 'occupancy';
 
  // Data
  occupancy: OccupancyReport | null = null;
  revenue:   RevenueReport   | null = null;
  dues:      TenantDuesReport | null = null;
 
  // Loading/error per tab
  loadingOccupancy = false;
  loadingRevenue   = false;
  loadingDues      = false;
  errorOccupancy   = '';
  errorRevenue     = '';
  errorDues        = '';
 
  // Revenue filter
  selectedMonth = new Date().getMonth() + 1;
  selectedYear  = new Date().getFullYear();
 
  readonly MONTH_NAMES = MONTH_NAMES;
  readonly months = [1,2,3,4,5,6,7,8,9,10,11,12];
  readonly years  = [2024, 2025, 2026, 2027];
 
  ngOnInit(): void {
    this.loadOccupancy();
  }
 
  switchTab(tab: 'occupancy' | 'revenue' | 'dues'): void {
    this.activeTab = tab;
    // Lazy load — only fetch when tab is first opened
    if (tab === 'occupancy' && !this.occupancy) this.loadOccupancy();
    if (tab === 'revenue'   && !this.revenue)   this.loadRevenue();
    if (tab === 'dues'      && !this.dues)       this.loadDues();
    this.cdr.detectChanges();
  }
 
  loadOccupancy(): void {
    this.loadingOccupancy = true;
    this.errorOccupancy   = '';
    this.reportService.getOccupancyReport().subscribe({
      next: (data) => {
        this.occupancy        = data;
        this.loadingOccupancy = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingOccupancy = false;
        this.errorOccupancy   = 'Failed to load occupancy report.';
        this.cdr.detectChanges();
      }
    });
  }
 
  loadRevenue(): void {
    this.loadingRevenue = true;
    this.errorRevenue   = '';
    this.reportService
      .getRevenueReport(this.selectedMonth, this.selectedYear)
      .subscribe({
        next: (data) => {
          this.revenue        = data;
          this.loadingRevenue = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loadingRevenue = false;
          this.errorRevenue   = 'Failed to load revenue report.';
          this.cdr.detectChanges();
        }
      });
  }
 
  onRevenueFilterChange(): void {
    this.revenue = null;  // clear old data
    this.loadRevenue();
  }
 
  loadDues(): void {
    this.loadingDues = true;
    this.errorDues   = '';
    this.reportService.getTenantDuesReport().subscribe({
      next: (data) => {
        this.dues        = data;
        this.loadingDues = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingDues = false;
        this.errorDues   = 'Failed to load dues report.';
        this.cdr.detectChanges();
      }
    });
  }
 
  formatCurrency(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN');
  }
 
  formatRate(rate: number): string {
    return rate.toFixed(1) + '%';
  }
 
  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      DUE:     'badge-danger',
      PARTIAL: 'badge-warning',
      PAID:    'badge-success',
    };
    return map[status] ?? 'badge-secondary';
  }
}
