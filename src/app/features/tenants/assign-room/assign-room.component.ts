import { Component, Input, Output, EventEmitter,
         OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup,
         Validators, ReactiveFormsModule } from '@angular/forms';
import { TenantService } from '../../../core/services/tenant.service';
import { RoomService } from '../../../core/services/room.service';
import { Tenant } from '../../../core/models/tenant.model';
import { Room } from '../../../core/models/room.model';
 
@Component({
  selector: 'app-assign-room',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './assign-room.component.html',
  styleUrl: './assign-room.component.css'
})
export class AssignRoomComponent implements OnInit {
 
  @Input()  tenant!: Tenant;
  @Output() assigned  = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
 
  private fb            = inject(FormBuilder);
  private tenantService = inject(TenantService);
  private roomService   = inject(RoomService);
  private cdr           = inject(ChangeDetectorRef);
 
  assignForm!: FormGroup;
  availableRooms: Room[] = [];
  isLoadingRooms = true;
  isSubmitting   = false;
  errorMsg       = '';
 
  ngOnInit(): void {
    this.assignForm = this.fb.group({
      roomId: [null, Validators.required]
    });
 
    // Load available rooms from API
    this.roomService.getRooms('AVAILABLE').subscribe({
      next: (rooms) => {
        this.availableRooms = rooms;
        this.isLoadingRooms = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingRooms = false;
        this.errorMsg = 'Failed to load available rooms.';
        this.cdr.detectChanges();
      }
    });
  }
 
  onSubmit(): void {
    if (this.assignForm.invalid) return;
    this.isSubmitting = true;
    this.errorMsg = '';
 
    this.tenantService.assignRoom(this.tenant.id, {
      roomId: Number(this.assignForm.value.roomId)
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.assigned.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMsg = err?.error?.message ?? 'Failed to assign room.';
        this.cdr.detectChanges();
      }
    });
  }
 
  onCancel(): void { this.cancelled.emit(); }
}
