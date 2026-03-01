import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../core/services/room.service';
import { Room } from '../../core/models/room.model';
import { RoomFormComponent } from './room-form/room-form.component';
import { DeleteConfirmComponent } from './delete-confirm/delete-confirm.component';
 
@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [NgClass, FormsModule, RoomFormComponent, DeleteConfirmComponent],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent implements OnInit {
 
  private roomService = inject(RoomService);
  private cdr         = inject(ChangeDetectorRef);
 
  // Data
  rooms: Room[]         = [];
  filteredRooms: Room[] = [];
 
  // State
  isLoading  = true;
  errorMsg   = '';
 
  // Filter
  selectedStatus = 'ALL';
  searchText     = '';
 
  // Modal state
  showForm       = false;
  editRoom: Room | null = null;
  showDeleteConfirm     = false;
  roomToDelete: Room | null = null;
 
  readonly statusOptions = ['ALL', 'AVAILABLE', 'OCCUPIED', 'MAINTENANCE'];
 
  ngOnInit(): void {
    this.loadRooms();
  }
 
  loadRooms(): void {
    this.isLoading = true;
    this.roomService.getRooms().subscribe({
      next: (data) => {
        this.rooms     = data;
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.errorMsg  = 'Failed to load rooms.';
        this.cdr.detectChanges();
      }
    });
  }
 
  applyFilter(): void {
    this.filteredRooms = this.rooms.filter(r => {
      const matchStatus = this.selectedStatus === 'ALL' ||
                          r.status === this.selectedStatus;
      const matchSearch = !this.searchText ||
                          r.roomNumber.toLowerCase()
                           .includes(this.searchText.toLowerCase());
      return matchStatus && matchSearch;
    });
    this.cdr.detectChanges();
  }
 
  onFilterChange(): void { this.applyFilter(); }
 
  // ── Create ──────────────────────────────────────────
  openCreate(): void {
    this.editRoom = null;
    this.showForm = true;
    this.cdr.detectChanges();
  }
 
  // ── Edit ────────────────────────────────────────────
  openEdit(room: Room): void {
    this.editRoom = room;
    this.showForm = true;
    this.cdr.detectChanges();
  }
 
  // ── Called when form is saved ────────────────────────
  onFormSaved(): void {
    this.showForm = false;
    this.editRoom = null;
    this.loadRooms();  // refresh list
  }
 
  onFormCancelled(): void {
    this.showForm = false;
    this.editRoom = null;
    this.cdr.detectChanges();
  }
 
  // ── Delete ──────────────────────────────────────────
  openDelete(room: Room): void {
    this.roomToDelete     = room;
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }
 
  onDeleteConfirmed(): void {
    if (!this.roomToDelete) return;
    this.roomService.deleteRoom(this.roomToDelete.id).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.roomToDelete      = null;
        this.loadRooms();
      },
      error: (err) => {
        this.showDeleteConfirm = false;
        this.errorMsg = err?.error?.message ?? 'Cannot delete room.';
        this.cdr.detectChanges();
      }
    });
  }
 
  onDeleteCancelled(): void {
    this.showDeleteConfirm = false;
    this.roomToDelete      = null;
    this.cdr.detectChanges();
  }
 
  // ── Helpers ─────────────────────────────────────────
  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      AVAILABLE:   'badge-success',
      OCCUPIED:    'badge-info',
      MAINTENANCE: 'badge-warning',
    };
    return map[status] ?? 'badge-secondary';
  }
}
