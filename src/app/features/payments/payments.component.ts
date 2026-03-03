import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { PaymentService } from '../../core/services/payment.service';
import { RentRecord, MONTH_NAMES } from '../../core/models/payment.model';
import { RecordPaymentComponent } from './record-payment/record-payment.component';
import { GenerateMonthlyComponent } from './generate-monthly/generate-monthly.component';
 
@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [NgClass,RecordPaymentComponent, GenerateMonthlyComponent],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
 
  private paymentService = inject(PaymentService);
  private cdr            = inject(ChangeDetectorRef);
 
  // Data
  dues: RentRecord[] = [];
 
  // State
  isLoading = true;
  errorMsg  = '';
  activeTab: 'dues' | 'generate' = 'dues';
 
  // Modal state
  showRecordPayment    = false;
  showGenerateMonthly  = false;
  selectedRecord: RentRecord | null = null;
 
  readonly MONTH_NAMES = MONTH_NAMES;
 
  ngOnInit(): void { this.loadDues(); }
 
  loadDues(): void {
    this.isLoading = true;
    this.errorMsg  = '';
    this.paymentService.getOutstandingDues().subscribe({
      next: (data) => {
        this.dues      = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.errorMsg  = 'Failed to load outstanding dues.';
        this.cdr.detectChanges();
      }
    });
  }
 
  openRecordPayment(record: RentRecord): void {
    this.selectedRecord   = record;
    this.showRecordPayment = true;
    this.cdr.detectChanges();
  }
 
  onPaymentRecorded(): void {
    this.showRecordPayment = false;
    this.selectedRecord   = null;
    this.loadDues();
  }
 
  onPaymentCancelled(): void {
    this.showRecordPayment = false;
    this.selectedRecord   = null;
    this.cdr.detectChanges();
  }
 
  openGenerateMonthly(): void {
    this.showGenerateMonthly = true;
    this.cdr.detectChanges();
  }
 
  onMonthlyGenerated(): void {
    this.showGenerateMonthly = false;
    this.loadDues();
  }
 
  onGenerateCancelled(): void {
    this.showGenerateMonthly = false;
    this.cdr.detectChanges();
  }
 
  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      DUE:     'badge-danger',
      PARTIAL: 'badge-warning',
      PAID:    'badge-success',
    };
    return map[status] ?? 'badge-secondary';
  }
 
  formatCurrency(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN');
  }
}
