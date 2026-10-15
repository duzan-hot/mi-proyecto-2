import { rooms as seedRooms, services as seedServices } from "../data/catalog";
import { storageService } from "../services/storageService";
const seedGarage: Garage = {
id: "garage-1",
totalCapacity: 20,
status: "Activo",
createdAt: new Date().toISOString(),
};
import type { ExtraService, Garage, Reservation, Room } from "../types/hospitality";

const get = <T,>(key: string, seed: T): T => { const stored = storageService.get<T>(key); if (stored) return stored; storageService.set(key, seed); return seed; };
const set = <T,>(key: string, value: T) => storageService.set(key, value);
const getToday = () => {
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

return `${year}-${month}-${day}`;
};
export const hospitalityRepository = {
  rooms: () => get<Room[]>("stay_rooms", seedRooms),
  services: () => get<ExtraService[]>("stay_services", seedServices),
  reservations: () => get<Reservation[]>("stay_reservations", []),
  garage: () => get<Garage>("stay_garage", seedGarage),
  saveGarage: (value: Garage) => set("stay_garage", value),
  saveRooms: (value: Room[]) => set("stay_rooms", value), saveServices: (value: ExtraService[]) => set("stay_services", value),
  saveReservation(reservation: Reservation) { const all = this.reservations(); set("stay_reservations", [reservation, ...all]); },
  updateReservation(reservation: Reservation) { set("stay_reservations", this.reservations().map((item) => item.id === reservation.id ? reservation : item)); },
  isAvailable(roomId: string, checkIn: string, checkOut: string) { return !this.reservations().some((r) => r.roomId === roomId && r.status !== "Cancelada" && checkIn < r.checkOut && checkOut > r.checkIn); },
occupiedGarageSpaces() {
const today = getToday();

return this.reservations().filter(
(reservation) =>
reservation.garage === true &&
reservation.status === "Activa" &&
reservation.checkIn <= today &&
reservation.checkOut > today
).length;
},
reservedGarageSpaces(checkIn: string, checkOut: string) {
return this.reservations().filter(
(reservation) =>
reservation.garage === true &&
reservation.status === "Activa" &&
checkIn < reservation.checkOut &&
checkOut > reservation.checkIn
).length;
},
};

