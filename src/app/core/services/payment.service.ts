import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RentRecord, Payment,
         RecordPaymentRequest } from '../models/payment.model';
 
@Injectable({ providedIn: 'root' })
export class PaymentService {
 
  private http = inject(HttpClient);
  private API  = environment.apiUrl;
 
  // GET /api/payments/dues -> List<RentRecordResponse> (plain array)
  getOutstandingDues(): Observable<RentRecord[]> {
    return this.http.get<RentRecord[]>(`${this.API}/api/payments/dues`);
  }
 
  // GET /api/payments/tenant/{id} -> Page<RentRecordResponse>
  getRentRecordsByTenant(tenantId: number): Observable<RentRecord[]> {
    return this.http
      .get<{ content: RentRecord[] }>(
        `${this.API}/api/payments/tenant/${tenantId}`)
      .pipe(map(r => r.content));
  }
 
  // GET /api/payments/record/{rentRecordId} -> List<PaymentResponse>
  getPaymentsByRecord(rentRecordId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(
      `${this.API}/api/payments/record/${rentRecordId}`);
  }
 
  // POST /api/payments -> record a payment
  recordPayment(request: RecordPaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(
      `${this.API}/api/payments`, request);
  }
 
  // POST /api/payments/generate-monthly?month=&year=
  generateMonthly(month: number, year: number): Observable<RentRecord[]> {
    const params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());
    return this.http.post<RentRecord[]>(
      `${this.API}/api/payments/generate-monthly`, null, { params });
  }
}
