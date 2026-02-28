export type TenantStatus = 'ACTIVE' | 'INACTIVE' | 'EVICTED';
 
export interface Tenant {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  roomId?: number;
  roomNumber?: string;
  securityDeposit: number;
  status: TenantStatus;
  joinDate: string;
}
 
export interface CreateTenantRequest {
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  securityDeposit: number;
}
 
export interface AssignRoomRequest {
  roomId: number;
}
