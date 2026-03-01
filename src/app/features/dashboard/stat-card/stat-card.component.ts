import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
 
@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css'
})
export class StatCardComponent {
 
  // Data passed in from DashboardComponent
  @Input() title: string  = '';
  @Input() value: string  = '0';   // string so we can pass "60%" or "₹8,500"
  @Input() icon: string   = '📊';
  @Input() color: string  = 'blue'; // blue | green | orange | red | purple
  @Input() subtitle: string = '';
}
