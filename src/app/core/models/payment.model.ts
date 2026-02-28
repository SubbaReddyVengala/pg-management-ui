export type RentStatus  = 'DUE' | 'PARTIAL' | 'PAID';
export type PaymentMode = 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE';
 
export interface RentRecord {
  id: number;
  tenantId: number;
  roomId: number;
  rentMonth: number;
  rentYear: number;
  rentAmount: number;
  totalPaid: number;
  dueAmount: number;
  status: RentStatus;
  createdAt: string;
}
 
export interface RecordPaymentRequest {
  rentRecordId: number;
  amountPaid: number;
  paymentMode: PaymentMode;
  referenceNumber?: string;
}
 
export interface PaymentRecord {
  id: number;
  rentRecordId: number;
  amountPaid: number;
  paymentMode: PaymentMode;
  referenceNumber?: string;
  paymentDate: string;
  createdAt: string;
}
