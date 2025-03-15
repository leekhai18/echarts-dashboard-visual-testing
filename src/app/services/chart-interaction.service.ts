import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ChartData {
  name: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChartInteractionService {
  private selectedData = new BehaviorSubject<ChartData | null>(null);

  selectedData$ = this.selectedData.asObservable();

  updateSelectedData(data: ChartData | null) {
    this.selectedData.next(data);
  }

  clearSelection() {
    this.selectedData.next(null);
  }
}
