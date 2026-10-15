import React from "react";
import { Link } from "react-router-dom";
import { hospitalityRepository } from "../repositories/hospitalityRepository";
import { authRepository } from "../repositories/authRepository";
import type { ExtraService, Garage, Room } from "../types/hospitality";
const Card=({label,value,icon}:{label:string;value:string|number;icon:string})=><article className="stat-card"><span>{icon}</span><div><b>{value}</b><p>{label}</p></div></article>;
export function AdminDashboard(){const rooms=hospitalityRepository.rooms(), res=hospitalityRepository.reservations();return <main className="admin page-section"><p className="eyebrow">PANEL ADMINISTRATIVO</p><h1>Buenos días, Administrador</h1><p>Una vista rápida del funcionamiento de Casa Aurora.</p><div className="stats"><Card icon="♙" value={authRepository.getUsers().length} label="Usuarios registrados"/><Card icon="⌂" value={rooms.length} label="Habitaciones"/><Card icon="✓" value={rooms.filter(r=>r.status==="Disponible").length} label="Disponibles"/><Card icon="▣" value={res.filter(r=>r.status==="Activa").length} label="Reservas activas"/></div><section className="panel quick"><h2>Gestión rápida</h2><div>{[["/admin/rooms","Gestionar habitaciones"],["/admin/reservations","Ver reservas"],["/admin/services","Administrar servicios"],["/admin/garage","Gestionar garaje"]].map(([to,label])=><Link className="text-link" to={to} key={to}>{label} →</Link>)}</div></section></main>}
const statusClass=(status:string)=>status==="Disponible"||status==="Activa"||status==="Pagado"?"badge available":"badge";
export function AdminUsers(){const users=authRepository.getUsers();return <AdminTable title="Usuarios" description="Gestiona el acceso de huéspedes y administradores."><table><thead><tr><th>Usuario</th><th>CI</th><th>Rol</th><th>Estado</th><th></th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td><b>{u.name}</b></td><td>{u.carnet}</td><td>{u.role==="ADMIN"?"Administrador":"Cliente"}</td><td><span className={statusClass(u.active===false?"Inactivo":"Activo")}>{u.active===false?"Inactivo":"Activo"}</span></td><td>{u.role!=="ADMIN"&&<button className="text-link" onClick={()=>{authRepository.toggleUser(u.id);location.reload()}}>{u.active===false?"Activar":"Desactivar"}</button>}</td></tr>)}</tbody></table></AdminTable>}
export function AdminRooms(){const rooms=hospitalityRepository.rooms();const change=(room:Room)=>{const next=room.status==="Disponible"?"Mantenimiento":"Disponible";hospitalityRepository.saveRooms(rooms.map(r=>r.id===room.id?{...r,status:next}:r));location.reload()};return <AdminTable title="Habitaciones" description="Controla el inventario, disponibilidad y mantenimiento."><table><thead><tr><th>Número</th><th>Tipo</th><th>Capacidad</th><th>Precio</th><th>Estado</th><th></th></tr></thead><tbody>{rooms.map(r=><tr key={r.id}><td><b>{r.number}</b> · Piso {r.floor}</td><td>{r.type}</td><td>{r.capacity} personas</td><td>Bs {r.price}</td><td><span className={statusClass(r.status)}>{r.status}</span></td><td><button className="text-link" onClick={()=>change(r)}>Cambiar estado</button></td></tr>)}</tbody></table></AdminTable>}
export function AdminReservations(){const all=hospitalityRepository.reservations();return <AdminTable title="Reservas" description="Consulta y actualiza las reservas de todos los huéspedes."><table><thead><tr><th>Reserva</th><th>Cliente</th><th>Habitación</th><th>Fechas</th><th>Total</th><th>Estado</th></tr></thead><tbody>{all.map(r=>{const room=hospitalityRepository.rooms().find(x=>x.id===r.roomId);return <tr key={r.id}><td>{r.id}</td><td>{r.guestName}</td><td>{room?.number}</td><td>{r.checkIn} — {r.checkOut}</td><td>Bs {r.total}</td><td><select value={r.status} onChange={e=>{hospitalityRepository.updateReservation({...r,status:e.target.value as typeof r.status});location.reload()}}>{["Activa","Finalizada","Cancelada"].map(s=><option key={s}>{s}</option>)}</select></td></tr>})}</tbody></table>{!all.length&&<p className="empty">Todavía no hay reservas registradas.</p>}</AdminTable>}
export function AdminServices(){const all=hospitalityRepository.services();const toggle=(s:ExtraService)=>{hospitalityRepository.saveServices(all.map(x=>x.id===s.id?{...x,active:!x.active}:x));location.reload()};return <AdminTable title="Servicios adicionales" description="Activa o desactiva los extras disponibles durante la reserva."><table><thead><tr><th>Servicio</th><th>Descripción</th><th>Precio / noche</th><th>Estado</th><th></th></tr></thead><tbody>{all.map(s=><tr key={s.id}><td><b>{s.icon} {s.name}</b></td><td>{s.description}</td><td>Bs {s.price}</td><td><span className={statusClass(s.active?"Activo":"Inactivo")}>{s.active?"Activo":"Inactivo"}</span></td><td><button className="text-link" onClick={()=>toggle(s)}>{s.active?"Desactivar":"Activar"}</button></td></tr>)}</tbody></table></AdminTable>}
function AdminTable({title,description,children}:{title:string;description:string;children:React.ReactNode}){return <main className="page-section admin"><p className="eyebrow">ADMINISTRACIÓN</p><h1>{title}</h1><p>{description}</p><section className="panel table-wrap">{children}</section></main>}

export function AdminGarage() {
const garage = hospitalityRepository.garage();
const occupied = hospitalityRepository.occupiedGarageSpaces();
const [capacity, setCapacity] = React.useState(String(garage.totalCapacity));
const [status, setStatus] = React.useState<Garage["status"]>(garage.status);

const saveGarage = () => {
const totalCapacity = Number(capacity);

if (!Number.isInteger(totalCapacity) || totalCapacity < occupied || totalCapacity < 1) {
  alert(`La capacidad debe ser un número entero mayor o igual a ${occupied}.`);
  return;
}

hospitalityRepository.saveGarage({
  ...garage,
  totalCapacity,
  status,
});

alert("Configuración del garaje guardada correctamente.");
location.reload();

};

return (
<AdminTable
   title="Gestión del garaje"
   description="Controla la capacidad, la ocupación y el estado del garaje."
 >
<div className="stats">
<Card icon="▦" label="Capacidad total" value={garage.totalCapacity} />
<Card icon="🚗" label="Vehículos ocupando espacio" value={occupied} />
<Card icon="✓" label="Espacios disponibles" value={Math.max(0, garage.totalCapacity - occupied)} />
</div>

  <section className="panel">
    <h2>Configuración del garaje</h2>

    <label htmlFor="garage-capacity">Capacidad total de vehículos</label>
    <input
      id="garage-capacity"
      type="number"
      min={Math.max(1, occupied)}
      step="1"
      value={capacity}
      onChange={(event) => setCapacity(event.target.value)}
    />

    <label htmlFor="garage-status">Estado del garaje</label>
    <select
      id="garage-status"
      value={status}
      onChange={(event) => setStatus(event.target.value as Garage["status"])}
    >
      <option value="Activo">Activo</option>
      <option value="Inactivo">Inactivo</option>
    </select>

    <button className="text-link" type="button" onClick={saveGarage}>
      Guardar configuración
    </button>
  </section>
</AdminTable>

);
}