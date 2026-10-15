export type RoomStatus = "Disponible" | "Ocupada" | "Mantenimiento";
export type ReservationStatus = "Activa" | "Finalizada" | "Cancelada";

export interface Room {
  id: string; number: string; type: string; floor: number; capacity: number; price: number;
  status: RoomStatus; garage: boolean; image: string; description: string; amenities: string[];
}
export interface ExtraService { id: string; name: string; icon: string; description: string; price: number; active: boolean; }
export interface Reservation {
  id: string; userId: string; guestName: string; roomId: string; checkIn: string; checkOut: string;
  nights: number; serviceIds: string[]; garage: boolean; total: number; status: ReservationStatus;
  createdAt: string;
}
export interface Garage {
  id: string;
  totalCapacity: number;
  status: "Activo" | "Inactivo";
  createdAt: string;
}