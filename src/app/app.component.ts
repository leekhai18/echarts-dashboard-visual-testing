import { Component } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent],
  template: `
    <div class="app-container">
      <h1>Interactive Dashboard</h1>
      <app-dashboard></app-dashboard>
    </div>
  `,
  styles: [`
    .app-container {
      padding: 20px;
    }
    h1 {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
    }
  `]
})
export class AppComponent {}
