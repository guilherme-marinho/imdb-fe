import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private dataSource = new BehaviorSubject(false);
  data = this.dataSource.asObservable();
  loading = false;

  constructor() {}

  on(): void {
    this.updatedDataSelection(true);
  }

  off(): void {
    this.updatedDataSelection(false);
  }

  private updatedDataSelection(data: boolean): void {
    this.dataSource.next(data);
    this.loading = data;
  }
}
