import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Tenant, CreateTenantRequest, AssignRoomRequest } from '../models/tenant.model';

@Injectable({ providedIn: 'root' })
export class TenantService {

  private http = inject(HttpClient);
  private API  = environment.apiUrl;

  // GET all tenants — unwrap paginated response
  getTenants(): Observable<Tenant[]> {
    return this.http
      .get<{ content: Tenant[] }>(`${this.API}/api/tenants`)
      .pipe(map(response => response.content));
  }

  getTenantById(id: number): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.API}/api/tenants/${id}`);
  }

  createTenant(tenant: CreateTenantRequest): Observable<Tenant> {
    return this.http.post<Tenant>(`${this.API}/api/tenants`, tenant);
  }

  assignRoom(tenantId: number, request: AssignRoomRequest): Observable<Tenant> {
    return this.http.post<Tenant>(
      `${this.API}/api/tenants/${tenantId}/assign-room`, request);
  }

  // FIXED: endpoint is /checkout not /vacate
  checkoutTenant(tenantId: number): Observable<Tenant> {
    return this.http.post<Tenant>(
      `${this.API}/api/tenants/${tenantId}/checkout`, {});
  }
}