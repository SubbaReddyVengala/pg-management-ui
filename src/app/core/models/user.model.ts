export interface User {
  userId: string;
  email: string;
  role: 'ADMIN' | 'TENANT';
}
 
export interface LoginRequest {
  email: string;
  password: string;
}
 
export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  email: string;
  role: string;
  userId: number;
}
 
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'TENANT';
}
