import { Component, Output, EventEmitter,
         OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup,
         Validators, ReactiveFormsModule } from '@angular/forms';
import { PaymentService } from '../../../core/services/payment.service';
import { MONTH_NAMES } from '../../../core/models/payment.model';
 
@Component({
  selector: 'app-generate-monthly',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './generate-monthly.component.html',
  styleUrl: './generate-monthly.component.css'
})
export class GenerateMonthlyComponent implements OnInit {
 
  @Output() generated = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
 
  private fb             = inject(FormBuilder);
  private paymentService = inject(PaymentService);
  private cdr            = inject(ChangeDetectorRef);
 
  generateForm!: FormGroup;
  isLoading    = false;
  errorMsg     = '';
  successMsg   = '';
  generatedCount = 0;
 
  readonly MONTH_NAMES = MONTH_NAMES;
  readonly months = [1,2,3,4,5,6,7,8,9,10,11,12];
  readonly years  = [2024, 2025, 2026, 2027];
 
  ngOnInit(): void {
    const now = new Date();
    this.generateForm = this.fb.group({
      month: [now.getMonth() + 1, Validators.required],
      year:  [now.getFullYear(),  Validators.required],
    });
  }
 
  onSubmit(): void {
    if (this.generateForm.invalid) return;
    this.isLoading  = true;
    this.errorMsg   = '';
    this.successMsg = '';
 
    const { month, year } = this.generateForm.value;
    this.paymentService.generateMonthly(month, year).subscribe({
      next: (records) => {
        this.isLoading    = false;
        this.generatedCount = records.length;
        this.successMsg   =
          `Successfully generated ${records.length} rent record(s) for`,
          + ` ${MONTH_NAMES[month]} ${year}.`;
        this.cdr.detectChanges();
        // Auto close after 2 seconds
        setTimeout(() => this.generated.emit(), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg  = err?.error?.message
          ?? 'Failed to generate records. Records may already exist for this month.';
        this.cdr.detectChanges();
      }
    });
  }
 
  onCancel(): void { this.cancelled.emit(); }
}
