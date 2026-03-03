export type TenantStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'EVICTED';

export interface Tenant {
  id: number;
  userId: number;
  roomId?: number;          // number, NO roomNumber field
  fullName: string;
  email: string;
  phone: string;
  emergencyContact?: string;
  joinDate: string;         // LocalDate comes as "2026-03-01"
  securityDeposit: number;
  status: TenantStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantRequest {
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  emergencyContact?: string;
  securityDeposit: number;
}

export interface AssignRoomRequest {
  roomId: number;
}

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'TENANT';
}

export interface RegisterUserResponse {
  userId: number;
  email: string;
  role: string;
}