import { Component, Input, Output, EventEmitter,
         OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup,
         Validators, ReactiveFormsModule } from '@angular/forms';
import { RoomService } from '../../../core/services/room.service';
import { Room } from '../../../core/models/room.model';

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './room-form.component.html',
  styleUrl: './room-form.component.css'
})
export class RoomFormComponent implements OnInit {

  @Input()  room: Room | null = null;
  @Output() saved     = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private fb          = inject(FormBuilder);
  private roomService = inject(RoomService);
  private cdr         = inject(ChangeDetectorRef);

  roomForm!: FormGroup;
  isLoading = false;
  errorMsg  = '';

  get isEditMode(): boolean { return !!this.room; }

  readonly roomTypes  = ['SINGLE', 'DOUBLE', 'TRIPLE'];
  readonly statusOpts = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'];

  ngOnInit(): void {
    this.roomForm = this.fb.group({
      roomNumber:  ['',   [Validators.required]],
      floor:       [null, [Validators.required, Validators.min(1)]],       // CHANGED: 1 -> null
      roomType:    ['SINGLE', Validators.required],
      maxCapacity: [null, [Validators.required, Validators.min(1), Validators.max(10)]], // CHANGED: 1 -> null
      monthlyRent: [null, [Validators.required, Validators.min(0)]],       // CHANGED: 0 -> null
      amenities:   [''],
    });

    // Pre-fill form if editing
    if (this.room) {
      this.roomForm.patchValue({
        roomNumber:  this.room.roomNumber,
        floor:       this.room.floor,
        roomType:    this.room.roomType,
        maxCapacity: this.room.maxCapacity,
        monthlyRent: this.room.monthlyRent,
        amenities:   this.room.amenities ?? '',
      });
    }
  }

  onSubmit(): void {
    if (this.roomForm.invalid) {
      this.roomForm.markAllAsTouched();
      this.cdr.detectChanges();  // ADDED
      return;
    }
    this.isLoading = true;
    this.errorMsg  = '';

    const call = this.isEditMode
      ? this.roomService.updateRoom(this.room!.id, this.roomForm.value)
      : this.roomService.createRoom(this.roomForm.value);

    call.subscribe({
      next: () => {
        this.isLoading = false;
        this.saved.emit();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg  = err?.error?.message ?? 'Failed to save room.';
        this.cdr.detectChanges();
      }
    });
  }

  onCancel(): void { this.cancelled.emit(); }

  fc(name: string) { return this.roomForm.get(name)!; }
}