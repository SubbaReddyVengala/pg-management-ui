import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgClass, SlicePipe } from '@angular/common';                        // <-- line to change
import { FormsModule } from '@angular/forms';
import { TenantService } from '../../core/services/tenant.service';
import { Tenant } from '../../core/models/tenant.model';
import { TenantFormComponent } from './tenant-form/tenant-form.component';
import { AssignRoomComponent } from './assign-room/assign-room.component';
import { VacateConfirmComponent } from './vacate-confirm/vacate-confirm.component';
@Component({
  selector: 'app-tenants',
  standalone: true,
  imports: [NgClass, SlicePipe, FormsModule,
          TenantFormComponent, AssignRoomComponent, VacateConfirmComponent],
  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.css'
})
export class TenantsComponent implements OnInit {
 
  private tenantService = inject(TenantService);
  private cdr           = inject(ChangeDetectorRef);
 
  tenants: Tenant[]         = [];
  filteredTenants: Tenant[] = [];
  isLoading = true;
  errorMsg  = '';
  searchText     = '';
  selectedStatus = 'ALL';
 
  // Modal state
  showTenantForm    = false;
  showAssignRoom    = false;
  showVacateConfirm = false;
  selectedTenant: Tenant | null = null;
 
readonly statusOptions = ['ALL', 'PENDING', 'ACTIVE', 'INACTIVE', 'EVICTED'];
 
  ngOnInit(): void { this.loadTenants(); }
 
  loadTenants(): void {
    this.isLoading = true;
    this.tenantService.getTenants().subscribe({
      next: (data) => {
        this.tenants = data;
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.errorMsg  = 'Failed to load tenants.';
        this.cdr.detectChanges();
      }
    });
  }
 
  applyFilter(): void {
    this.filteredTenants = this.tenants.filter(t => {
      const matchStatus = this.selectedStatus === 'ALL' ||
                          t.status === this.selectedStatus;
      const matchSearch = !this.searchText ||
                          t.fullName.toLowerCase()
                           .includes(this.searchText.toLowerCase()) ||
                          t.email.toLowerCase()
                           .includes(this.searchText.toLowerCase());
      return matchStatus && matchSearch;
    });
    this.cdr.detectChanges();
  }
 
  onFilterChange(): void { this.applyFilter(); }
 
  // Register new tenant
  openRegister(): void {
    this.showTenantForm = true;
    this.cdr.detectChanges();
  }
 
  onTenantRegistered(): void {
    this.showTenantForm = false;
    this.loadTenants();
  }
 
  onTenantFormCancelled(): void {
    this.showTenantForm = false;
    this.cdr.detectChanges();
  }
 
  // Assign room
  openAssignRoom(tenant: Tenant): void {
    this.selectedTenant = tenant;
    this.showAssignRoom  = true;
    this.cdr.detectChanges();
  }
 
  onRoomAssigned(): void {
    this.showAssignRoom  = false;
    this.selectedTenant = null;
    this.loadTenants();
  }
 
  onAssignCancelled(): void {
    this.showAssignRoom  = false;
    this.selectedTenant = null;
    this.cdr.detectChanges();
  }
 
  // Vacate
  openVacate(tenant: Tenant): void {
    this.selectedTenant   = tenant;
    this.showVacateConfirm = true;
    this.cdr.detectChanges();
  }
 
  onVacateConfirmed(): void {
  if (!this.selectedTenant) return;
  this.tenantService.checkoutTenant(this.selectedTenant.id).subscribe({
    next: () => {
      this.showVacateConfirm = false;
      this.selectedTenant   = null;
      this.loadTenants();
    },
    error: (err) => {
      this.showVacateConfirm = false;
      this.errorMsg = err?.error?.message ?? 'Failed to checkout tenant.';
      this.cdr.detectChanges();
    }
  });
}

 
  onVacateCancelled(): void {
    this.showVacateConfirm = false;
    this.selectedTenant   = null;
    this.cdr.detectChanges();
  }
 
  // Update getStatusClass to include PENDING
getStatusClass(status: string): string {
  const map: Record<string, string> = {
    PENDING:  'badge-warning',
    ACTIVE:   'badge-success',
    INACTIVE: 'badge-secondary',
    EVICTED:  'badge-danger',
  };
  return map[status] ?? 'badge-secondary';
}
}
