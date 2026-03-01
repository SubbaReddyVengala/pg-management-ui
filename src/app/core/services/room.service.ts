import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Room, CreateRoomRequest } from '../models/room.model';
import { map } from 'rxjs/operators';
import { PageResponse } from '../models/room.model';
@Injectable({ providedIn: 'root' })
export class RoomService {
 
  private http = inject(HttpClient);
  private API  = environment.apiUrl;
 
  // GET all rooms with optional status filter
 getRooms(status?: string): Observable<Room[]> {
  let params = new HttpParams();
  if (status && status !== 'ALL') {
    params = params.set('status', status);
  }
  return this.http
    .get<PageResponse<Room>>(`${this.API}/api/rooms`, { params })
    .pipe(map(response => response.content));
}
 
  // GET single room by id
  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.API}/api/rooms/${id}`);
  }
 
  // POST create new room
  createRoom(room: CreateRoomRequest): Observable<Room> {
    return this.http.post<Room>(`${this.API}/api/rooms`, room);
  }
 
  // PUT update existing room
  updateRoom(id: number, room: Partial<CreateRoomRequest>): Observable<Room> {
    return this.http.put<Room>(`${this.API}/api/rooms/${id}`, room);
  }
 
  // DELETE room
  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/api/rooms/${id}`);
  }
}
