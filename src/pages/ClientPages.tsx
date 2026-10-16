import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { authRepository } from "../repositories/authRepository";
import { hospitalityRepository } from "../repositories/hospitalityRepository";
import type { Reservation } from "../types/hospitality";

const money=(n:number)=>`Bs ${n.toFixed(0)}`;
export function ReservationPage(){const [search]=useSearchParams();const navigate=useNavigate();const room=hospitalityRepository.rooms().find(r=>r.id===(search.get("room")||""))||hospitalityRepository.rooms().find(r=>r.status==="Disponible");const[checkIn,setCheckIn]=useState("");const[checkOut,setCheckOut]=useState("");const[serviceIds,setServices]=useState<string[]>([]);const [garage, setGarage] = useState(false);
const [error, setError] = useState("");
const garageConfig = hospitalityRepository.garage();
const occupiedGarage = hospitalityRepository.occupiedGarageSpaces();
const availableGarage = Math.max(0, garageConfig.totalCapacity - occupiedGarage);
const garageEnabled = garageConfig.status === "Activo" && availableGarage > 0;if(!room)return <Navigate to="/rooms"/>;const nights=checkIn&&checkOut?Math.max(0,Math.ceil((+new Date(checkOut)-+new Date(checkIn))/86400000)):0;const extras=hospitalityRepository.services().filter(s=>serviceIds.includes(s.id));const total=nights*room.price+extras.reduce((a,s)=>a+s.price*nights,0)+(garage?50*nights:0);const submit=()=>{if(!checkIn||!checkOut||nights<1){setError("Selecciona fechas de ingreso y salida válidas.");return;}if(!hospitalityRepository.isAvailable(room.id,checkIn,checkOut)){setError("Esta habitación ya tiene una reserva en esas fechas.");return;}if (garage) {
const currentGarage = hospitalityRepository.garage();
const reserved = hospitalityRepository.reservedGarageSpaces(checkIn, checkOut);

if (currentGarage.status !== "Activo") {
setError("El garaje está inactivo y no se puede reservar.");
return;
}

if (reserved >= currentGarage.totalCapacity) {
setError("No quedan espacios de garaje disponibles para esas fechas.");
return;
}
}const user=authRepository.getCurrentUser()!;const reservation:Reservation={id:`RES-${checkIn.replaceAll("-","")}-${room.number}`,userId:user.id,guestName:user.name,roomId:room.id,checkIn,checkOut,nights,serviceIds,garage,total,status:"Activa",createdAt:checkIn};hospitalityRepository.saveReservation(reservation);sessionStorage.setItem("last_reservation",JSON.stringify(reservation));navigate("/reservation-confirmation")};return <main className="page-section reservation"><div><p className="eyebrow">RESERVA</p><h1>Personaliza tu reserva</h1><p>Elige las fechas y los detalles que harán tu estancia perfecta.</p><div className="panel form-panel"><div className="two-columns"><label>Fecha de ingreso<input type="date" min="2026-08-25" value={checkIn} onChange={e=>{
  const date = e.currentTarget.value;
  setCheckIn(date);
  if (checkOut && checkOut <= date) {
    setCheckOut("");
  }
  setError("");
}}/></label><label>Fecha de salida<input type="date" min={checkIn} value={checkOut} onChange={e=>{
  setCheckOut(e.currentTarget.value);
  setError("");
}}/></label></div><h3>Servicios adicionales</h3>{hospitalityRepository.services().filter(s=>s.active).map(s=><label className="check-row" key={s.id}><input type="checkbox" checked={serviceIds.includes(s.id)} onChange={()=>setServices(ids=>ids.includes(s.id)?ids.filter(i=>i!==s.id):[...ids,s.id])}/><span>{s.icon} <b>{s.name}</b><small>{s.description}</small></span><strong>+{money(s.price)}/noche</strong></label>)}{room.garage && garageEnabled&&<label className="check-row"><input type="checkbox" checked={garage} onChange={e=>setGarage(e.target.checked)}/><span>▣ <b>Espacio de garaje</b><small>{availableGarage} de {garageConfig.totalCapacity} espacios disponibles.</small></span><strong>+Bs 50/noche</strong></label>}{error&&<p className="error">{error}</p>}</div></div><aside className="summary"><img src={room.image} alt="Habitación"/><p className="eyebrow">HABITACIÓN {room.number}</p><h3>{room.type}</h3><p>
  Noches: {nights}
  {" · "}
  {checkIn || "--"} a {checkOut || "--"}
</p><hr/><p>Habitación <b>{money(nights*room.price)}</b></p>{extras.map(s=><p key={s.id}>{s.name}<b>{money(s.price*nights)}</b></p>)}{garage&&<p>Garaje<b>{money(50*nights)}</b></p>}<h2>Total <b>{money(total)}</b></h2><button className="button" onClick={submit}>Confirmar reserva →</button></aside></main>}
export function ConfirmationPage(){const r=JSON.parse(sessionStorage.getItem("last_reservation")||"null") as Reservation|null;if(!r)return <Navigate to="/my-reservations"/>;const room=hospitalityRepository.rooms().find(x=>x.id===r.roomId);return <main className="confirmation"><div className="success-icon">✓</div><p className="eyebrow">RESERVA CONFIRMADA</p><h1>¡Tu estancia está lista!</h1><p>Hemos guardado todos los detalles de tu reserva. Estamos encantados de recibirte.</p><article className="panel confirmation-card"><span>Reserva <b>{r.id}</b></span><span>Habitación <b>{room?.type} · {room?.number}</b></span><span>Fechas <b>{r.checkIn} → {r.checkOut}</b></span><span>Total <b>{money(r.total)}</b></span></article><Link className="button" to="/my-reservations">Ver mis reservas →</Link></main>}
export function MyReservationsPage(){const user=authRepository.getCurrentUser()!;const reservations=hospitalityRepository.reservations().filter(r=>r.userId===user.id);return <main className="page-section"><p className="eyebrow">MI CUENTA</p><h1>Mis reservas</h1><div className="reservation-list">{reservations.map(r=>{const room=hospitalityRepository.rooms().find(x=>x.id===r.roomId);return <article className="panel" key={r.id}><div><span className="badge available">{r.status}</span><h3>{room?.type} · Hab. {room?.number}</h3><p>{r.checkIn} → {r.checkOut} · {r.nights} noches</p></div><div><p>Reserva {r.id}</p><b>{money(r.total)}</b></div></article>})}</div>{!reservations.length&&<div className="empty"><p>Aún no tienes reservas.</p><Link className="button" to="/rooms">Buscar habitaciones</Link></div>}</main>}
export function ProfilePage(){const user=authRepository.getCurrentUser()!;const all=hospitalityRepository.reservations().filter(r=>r.userId===user.id);return <main className="page-section profile"><p className="eyebrow">MI PERFIL</p><h1>Hola, {user.name}</h1><div className="profile-grid"><article className="panel"><h3>Datos personales</h3><p><b>CI:</b> {user.carnet}</p><p><b>Apellidos:</b> {user.paternalSurname||"—"} {user.maternalSurname||""}</p><p><b>Cuenta:</b> Huésped activo</p></article><article className="panel"><h3>Resumen de estancias</h3><p><b>{all.filter(r=>r.status==="Activa").length}</b> reservas activas</p><p><b>{all.filter(r=>r.status==="Finalizada").length}</b> estancias finalizadas</p><Link className="text-link" to="/my-reservations">Ver historial →</Link></article></div></main>}
