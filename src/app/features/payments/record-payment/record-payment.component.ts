import { Component, Input, Output, EventEmitter,
         OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup,
         Validators, ReactiveFormsModule } from '@angular/forms';
import { PaymentService } from '../../../core/services/payment.service';
import { RentRecord, MONTH_NAMES } from '../../../core/models/payment.model';
 
@Component({
  selector: 'app-record-payment',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './record-payment.component.html',
  styleUrl: './record-payment.component.css'
})
export class RecordPaymentComponent implements OnInit {
 
  @Input()  rentRecord!: RentRecord;
  @Output() paid      = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
 
  private fb             = inject(FormBuilder);
  private paymentService = inject(PaymentService);
  private cdr            = inject(ChangeDetectorRef);
 
  paymentForm!: FormGroup;
  isLoading = false;
  errorMsg  = '';
 
  readonly MONTH_NAMES  = MONTH_NAMES;
  readonly paymentModes = ['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE'];
 
  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      amountPaid:      [this.rentRecord.dueAmount,
                        [Validators.required, Validators.min(1)]],
      paymentMode:     ['CASH', Validators.required],
      referenceNumber: [''],
    });
  }
 
  fc(name: string) { return this.paymentForm.get(name)!; }
 
  get selectedMode(): string {
    return this.paymentForm.value.paymentMode;
  }
 
  // Show reference number for non-cash payments
  get showReference(): boolean {
    return this.selectedMode !== 'CASH';
  }
 
  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMsg  = '';
 
    this.paymentService.recordPayment({
      rentRecordId:    this.rentRecord.id,
      amountPaid:      Number(this.paymentForm.value.amountPaid),
      paymentMode:     this.paymentForm.value.paymentMode,
      referenceNumber: this.paymentForm.value.referenceNumber || undefined,
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.paid.emit();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg  = err?.error?.message ?? 'Failed to record payment.';
        this.cdr.detectChanges();
      }
    });
  }
 
  onCancel(): void { this.cancelled.emit(); }
 
  formatCurrency(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN');
  }
}
