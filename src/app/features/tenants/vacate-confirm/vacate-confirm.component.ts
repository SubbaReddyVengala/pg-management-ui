import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tenant } from '../../../core/models/tenant.model';
 
@Component({
  selector: 'app-vacate-confirm',
  standalone: true,
  templateUrl: './vacate-confirm.component.html',
  styleUrl: './vacate-confirm.component.css'
})
export class VacateConfirmComponent {
  @Input()  tenant!: Tenant;
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}
