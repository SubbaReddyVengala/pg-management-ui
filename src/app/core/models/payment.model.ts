// Matches RentRecordResponse.java exactly
export type RentStatus = 'DUE' | 'PARTIAL' | 'PAID';
 
// Matches PaymentMode enum in your backend
export type PaymentMode = 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE';
 
export interface RentRecord {
  id: number;
  tenantId: number;
  roomId: number;
  rentMonth: number;       // 1-12
  rentYear: number;        // e.g. 2026
  rentAmount: number;
  totalPaid: number;
  dueAmount: number;
  status: RentStatus;
  createdAt: string;
}
 
// Matches PaymentResponse.java exactly
export interface Payment {
  id: number;
  rentRecordId: number;
  amountPaid: number;
  paymentMode: PaymentMode;
  referenceNumber?: string;
  paymentDate: string;
  createdAt: string;
}
 
// Matches RecordPaymentRequest.java exactly
export interface RecordPaymentRequest {
  rentRecordId: number;
  amountPaid: number;
  paymentMode: PaymentMode;
  referenceNumber?: string;
}
 
// Month names helper
export const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
