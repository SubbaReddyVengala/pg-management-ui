import { Component, Output, EventEmitter,
         OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup,
         Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TenantService } from '../../../core/services/tenant.service';
import { environment } from '../../../../environments/environment';
 
@Component({
  selector: 'app-tenant-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tenant-form.component.html',
  styleUrl: './tenant-form.component.css'
})
export class TenantFormComponent implements OnInit {
 
  @Output() registered = new EventEmitter<void>();
  @Output() cancelled  = new EventEmitter<void>();
 
  private fb            = inject(FormBuilder);
  private http          = inject(HttpClient);
  private tenantService = inject(TenantService);
  private cdr           = inject(ChangeDetectorRef);
  private API           = environment.apiUrl;
 
  tenantForm!: FormGroup;
  isLoading = false;
  errorMsg  = '';
 
  ngOnInit(): void {
    this.tenantForm = this.fb.group({
      name:            ['', Validators.required],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(6)]],
      phone:           ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      securityDeposit: [0,  [Validators.required, Validators.min(0)]],
    });
  }
 
  fc(name: string) { return this.tenantForm.get(name)!; }
 
  onSubmit(): void {
    if (this.tenantForm.invalid) {
      this.tenantForm.markAllAsTouched();
      return;
    }
 
    this.isLoading = true;
    this.errorMsg  = '';
    const v = this.tenantForm.value;
 
    // Step A: Register user account
    this.http.post<any>(`${this.API}/api/auth/register`, {
      name:     v.name,
      email:    v.email,
      password: v.password,
      role:     'TENANT'
    }).subscribe({
      next: (userResponse) => {
        // Step B: Create tenant profile with the userId from Step A
        this.tenantService.createTenant({
          userId:          userResponse.userId ?? userResponse.id,
          fullName:        v.name,
          email:           v.email,
          phone:           v.phone,
          emergencyContact: v.emergencyContact,
          securityDeposit: v.securityDeposit,
        }).subscribe({
          next: () => {
            this.isLoading = false;
            this.registered.emit();
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMsg  = err?.error?.message
              ?? 'Failed to create tenant profile.';
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg  = err?.error?.message
          ?? 'Failed to register user account.';
        this.cdr.detectChanges();
      }
    });
  }
 
  onCancel(): void { this.cancelled.emit(); }
}