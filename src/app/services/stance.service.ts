import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StanceService {
  constructor(private http: HttpClient) {}

  getStances(): Observable<any> {
    return this.http.get<any>('assets/data/stances.json');
  }

  getStanceById(id: string): Observable<any> {
    return this.http.get<any>(`assets/data/${encodeURIComponent(id)}.json`);
  }
}
