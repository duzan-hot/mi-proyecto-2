import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { RoomCard } from "../components/Cards";
import { authRepository } from "../repositories/authRepository";
import { hospitalityRepository } from "../repositories/hospitalityRepository";

const SectionTitle = ({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) => (
  <div className="section-title">
    <span>{eyebrow}</span>
    <h2>{title}</h2>
    {copy && <p>{copy}</p>}
  </div>
);

export function HomePage() {
  const [guests, setGuests] = useState(2);
  const navigate = useNavigate();

  const rooms = hospitalityRepository
    .rooms()
    .filter((room) => room.status === "Disponible");

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">HOSPEDAJE BOUTIQUE · SUCRE</p>

          <h1>
            Descansa donde
            <br />
            <i>todo se siente bien.</i>
          </h1>

          <p>
            Una estancia hecha de calma, detalles cálidos y experiencias que
            querrás repetir.
          </p>

          <div className="hero-actions">
            <Link className="button" to="/rooms">
              Reservar ahora
            </Link>

            <Link className="button ghost" to="/rooms">
              Ver habitaciones
            </Link>
          </div>
        </div>
      </section>

      <section className="availability">
        <div>
          <label>
            Ingreso
            <input type="date" />
          </label>

          <label>
            Salida
            <input type="date" />
          </label>

          <label>
            Huéspedes
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} persona{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          className="button"
          onClick={() => navigate(`/rooms?capacity=${guests}`)}
        >
          Buscar disponibilidad <span>→</span>
        </button>
      </section>

      <section className="page-section">
        <SectionTitle
          eyebrow="ELIGE TU ESTANCIA"
          title="Habitaciones que invitan a quedarte"
          copy="Espacios pensados para que cada viaje se sienta como una pausa."
        />

        <div className="room-grid">
          {rooms.slice(0, 3).map((room) => (
            <RoomCard room={room} key={room.id} />
          ))}
        </div>

        <div className="center">
          <Link className="text-link large" to="/rooms">
            Conocer todas las habitaciones →
          </Link>
        </div>
      </section>

      <section className="services-band">
        <div>
          <span className="eyebrow">CUIDAMOS CADA DETALLE</span>

          <h2>
            Más que una habitación,
            <br />
            una experiencia completa.
          </h2>

          <Link className="button ghost" to="/services">
            Explorar servicios
          </Link>
        </div>

        <div className="service-mini-grid">
          {hospitalityRepository
            .services()
            .slice(0, 4)
            .map((service) => (
              <div key={service.id}>
                <b>{service.icon}</b>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </div>
            ))}
        </div>
  </section>

      <footer className="hotel-footer">
        <div className="hotel-footer-content">
          <div className="hotel-footer-intro">
            <span className="eyebrow">ESTAMOS PARA AYUDARTE</span>
            <h2>Contacto</h2>
            <p>Será un gusto acompañarte en tu próxima estadía.</p>
          </div>

          <div className="hotel-footer-item">
            <span>☎</span>
            <div>
              <h3>Teléfono</h3>
              <p>+591 700 00000</p>
            </div>
          </div>

          <div className="hotel-footer-item">
            <span>◉</span>
            <div>
              <h3>WhatsApp</h3>
              <p>Contacto de demostración</p>
            </div>
          </div>

          <div className="hotel-footer-item">
            <span>f</span>
            <div>
              <h3>Facebook</h3>
              <p>Hotel — Página de demostración</p>
            </div>
          </div>

          <div className="hotel-footer-item">
            <span>⌖</span>
            <div>
              <h3>Dirección</h3>
              <p>Sucre, Bolivia · Proyecto académico</p>
            </div>
          </div>
        </div>

        <div className="hotel-footer-bottom">
  <strong>Casa Aurora</strong>
  <span>Hospedaje</span>
</div>
      </footer>
    </>
  );
}

export function RoomsPage() {
  const rooms = hospitalityRepository.rooms();

  return (
    <main className="page-section">
      <SectionTitle
        eyebrow="NUESTRAS HABITACIONES"
        title="Elige tu espacio"
        copy="Habitaciones pensadas para descansar y disfrutar."
      />

      <div className="room-grid">
        {rooms.map((room) => (
          <RoomCard room={room} key={room.id} />
        ))}
      </div>
    </main>
  );
}

export function RoomDetailPage() {
  const { id } = useParams();

  const room = hospitalityRepository
    .rooms()
    .find((item) => item.id === id);

  if (!room) {
    return (
      <main className="page-section">
        <h2>Habitación no encontrada</h2>

        <Link className="button" to="/rooms">
          Volver a habitaciones
        </Link>
      </main>
    );
  }

  return (
    <main className="page-section">
      <SectionTitle
        eyebrow="TU ESTANCIA"
        title={`Habitación ${room.number} · ${room.type}`}
        copy={room.description}
      />

      <div className="room-grid">
        <RoomCard room={room} />
      </div>

      <div className="center">
        <Link className="button" to="/rooms">
          Volver a habitaciones
        </Link>
      </div>
    </main>
  );
}

export function ServicesPage() {
  const services = hospitalityRepository.services();

  return (
    <main className="page-section">
      <SectionTitle
        eyebrow="A TU MEDIDA"
        title="Servicios para disfrutar sin prisa"
        copy="Añade los servicios que necesites para hacer tu estancia más especial."
      />

      <div className="service-mini-grid">
        {services.map((service) => (
          <div key={service.id}>
            <b>{service.icon}</b>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export function LoginPage() {
  const navigate = useNavigate();

  const [carnet, setCarnet] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = authRepository.login({
        carnet,
        password,
      });

      if (result) {
        navigate("/");
      } else {
        setError("Carnet o contraseña incorrectos.");
      }
    } catch {
      setError("No se pudo iniciar sesión.");
    }
  };

  if (authRepository.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="page-section auth-page">
      <div className="auth-card">
        <SectionTitle
          eyebrow="BIENVENIDO"
          title="Iniciar sesión"
          copy="Accede a tu cuenta para continuar."
        />

        <form onSubmit={submit}>
          <label>
            Carnet
            <input
              value={carnet}
              onChange={(e) => setCarnet(e.target.value)}
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p>{error}</p>}

          <button className="button" type="submit">
            Iniciar sesión
          </button>
        </form>

        <p>
          ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
        </p>
      </div>
    </main>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [paternalSurname, setPaternalSurname] = useState("");
  const [maternalSurname, setMaternalSurname] = useState("");
  const [carnet, setCarnet] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = authRepository.register({
        name,
        paternalSurname,
        maternalSurname,
        carnet,
        password,
      });

      if (result) {
        navigate("/login");
      } else {
        setError("No se pudo crear la cuenta.");
      }
    } catch {
      setError("No se pudo crear la cuenta.");
    }
  };

  return (
    <main className="page-section auth-page">
      <div className="auth-card">
        <SectionTitle
          eyebrow="NUEVA CUENTA"
          title="Crear cuenta"
          copy="Regístrate para gestionar tus reservas."
        />

        <form onSubmit={submit}>
          <label>
            Nombre
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Apellido paterno
            <input
              value={paternalSurname}
              onChange={(e) => setPaternalSurname(e.target.value)}
              required
            />
          </label>

          <label>
            Apellido materno
            <input
              value={maternalSurname}
              onChange={(e) => setMaternalSurname(e.target.value)}
              required
            />
          </label>

          <label>
            Carnet
            <input
              value={carnet}
              onChange={(e) => setCarnet(e.target.value)}
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p>{error}</p>}

          <button className="button" type="submit">
            Crear cuenta
          </button>
        </form>

        <p>
          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </main>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <SectionTitle
          eyebrow="CASA AURORA"
          title={title}
          copy={subtitle}
        />

        {children}
      </div>
    </main>
  );
}