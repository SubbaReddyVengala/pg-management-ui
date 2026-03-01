export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  totalActiveTenants: number;
  pendingTenants: number;
  currentMonthCollection: number;
  outstandingDuesCount: number;
  totalOutstandingAmount: number;
  occupancyRatePercent: number;
}