export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
export type RoomType   = 'SINGLE'    | 'DOUBLE'   | 'TRIPLE';
 
export interface Room {
  id: number;
  roomNumber: string;
  floor: number;
  roomType: RoomType;
  maxCapacity: number;
  currentOccupancy: number;
  monthlyRent: number;
  status: RoomStatus;
  amenities?: string;
  createdAt: string;
}
 
export interface CreateRoomRequest {
  roomNumber: string;
  floor: number;
  roomType: RoomType;
  maxCapacity: number;
  monthlyRent: number;
  amenities?: string;
}
