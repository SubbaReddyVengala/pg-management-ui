import { Component, Input, Output, EventEmitter } from '@angular/core';
 
@Component({
  selector: 'app-delete-confirm',
  standalone: true,
  templateUrl: './delete-confirm.component.html',
  styleUrl: './delete-confirm.component.css'
})
export class DeleteConfirmComponent {
  @Input()  roomNumber: string = '';
  @Output() confirmed  = new EventEmitter<void>();
  @Output() cancelled  = new EventEmitter<void>();
}
