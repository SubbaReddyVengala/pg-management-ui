// ── Dashboard ─────────────────────────────────────────────
// Matches DashboardResponse.java exactly
export interface DashboardStats {
  // Room stats
  totalRooms:             number;
  availableRooms:         number;
  occupiedRooms:          number;
  maintenanceRooms:       number;
  // Tenant stats
  totalActiveTenants:     number;
  pendingTenants:         number;
  // Payment stats (current month)
  currentMonthCollection: number;
  outstandingDuesCount:   number;
  totalOutstandingAmount: number;
  // Occupancy rate
  occupancyRatePercent:   number;
}
 
// ── Occupancy ─────────────────────────────────────────────
// Matches FloorStat inner class (inferred from OccupancyReport)
export interface FloorStat {
  floor:          number;
  totalRooms:     number;
  occupiedRooms:  number;
  availableRooms: number;
  capacity:       number;
  occupied:       number;
}
 
// Matches OccupancyReport.java exactly
export interface OccupancyReport {
  totalRooms:               number;
  totalCapacity:            number;
  totalOccupied:            number;
  totalAvailable:           number;
  occupancyRatePercent:     number;
  totalMonthlyRentPotential: number;
  floorBreakdown:           FloorStat[];
}
 
// ── Revenue ───────────────────────────────────────────────
// Matches RevenueReport.java exactly
export interface RevenueReport {
  month:                number;
  year:                 number;
  totalRentDue:         number;
  totalCollected:       number;
  totalOutstanding:     number;
  paidCount:            number;
  partialCount:         number;
  dueCount:             number;
  collectionRatePercent: number;
}
 
// ── Dues ──────────────────────────────────────────────────
// Matches TenantDuesReport.DueEntry inner class exactly
export interface DueEntry {
  tenantId:     number;
  rentRecordId: number;
  rentMonth:    number;
  rentYear:     number;
  dueAmount:    number;
  status:       string;
}
 
// Matches TenantDuesReport.java exactly
export interface TenantDuesReport {
  totalDefaulters: number;
  totalDueAmount:  number;
  dues:            DueEntry[];
}
 
// Month names helper (shared with payment module)
export const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
