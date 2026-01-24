import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import QRScanner from "./QRScanner";
import QRDisplay from "./QRDisplay";
import { FaUsers, FaQrcode, FaImages, FaUserCheck, FaUserTimes, FaUserClock } from "react-icons/fa";
import "../styles/admin.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("guests");
  const [guestData, setGuestData] = useState({
    confirmed: [],
    pending: [],
    declined: []
  });
  const [photos, setPhotos] = useState([]);
  const [stats, setStats] = useState({
    totalConfirmed: 0,
    totalPasses: 0,
    totalDeclined: 0,
    totalPhotos: 0
  });

  useEffect(() => {
    fetchGuestData();
    fetchPhotos();
  }, []);

  const fetchGuestData = async () => {
    const { data, error } = await supabase.from("rsvp").select("*").order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching guests:", error);
      return;
    }

    const confirmed = data.filter(g => g.asistira === true && g.invitados > 0);
    const declined = data.filter(g => g.asistira === false);
    const pending = data.filter(g => g.asistira === null || (g.asistira === true && g.invitados === 0));

    const totalPasses = confirmed.reduce((sum, g) => sum + g.invitados, 0);

    setGuestData({ confirmed, pending, declined });
    setStats({
      totalConfirmed: confirmed.length,
      totalPasses,
      totalDeclined: declined.length,
      totalPhotos: 0 // Will be updated by fetchPhotos
    });
  };

  const fetchPhotos = async () => {
    console.log("=== Starting photo fetch ===");

    // Fetch photos
    const { data: photosData, error: photosError } = await supabase
      .from("imagenes_boda")
      .select("*");

    console.log("Photos raw data:", photosData);
    console.log("Photos error:", photosError);

    if (photosError) {
      console.error("Error fetching photos:", photosError);
      return;
    }

    // Fetch all guests to map names
    const { data: guestsData, error: guestsError } = await supabase
      .from("rsvp")
      .select("id, nombre");

    console.log("Guests data:", guestsData);
    console.log("Guests error:", guestsError);

    if (guestsError) {
      console.error("Error fetching guests:", guestsError);
      return;
    }

    // Create a map of guest IDs to names
    const guestMap = {};
    guestsData.forEach(guest => {
      guestMap[guest.id] = guest.nombre;
    });

    console.log("Guest map:", guestMap);

    // Combine photos with guest names
    const photosWithNames = photosData.map(photo => ({
      ...photo,
      invitado: photo.invitado_id ? { nombre: guestMap[photo.invitado_id] } : null
    }));

    console.log("Photos with names:", photosWithNames);
    setPhotos(photosWithNames || []);
    setStats(prev => ({ ...prev, totalPhotos: photosWithNames?.length || 0 }));
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <h1>Panel Administrativo</h1>
        <p>Gestión de invitados y contenido</p>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card confirmed">
          <FaUserCheck className="stat-icon" />
          <div className="stat-content">
            <h3>{stats.totalConfirmed}</h3>
            <p>Confirmados</p>
            <span className="stat-detail">{stats.totalPasses} pases totales</span>
          </div>
        </div>
        <div className="stat-card declined">
          <FaUserTimes className="stat-icon" />
          <div className="stat-content">
            <h3>{stats.totalDeclined}</h3>
            <p>No Asistirán</p>
          </div>
        </div>
        <div className="stat-card pending">
          <FaUserClock className="stat-icon" />
          <div className="stat-content">
            <h3>{guestData.pending.length}</h3>
            <p>Sin Respuesta</p>
          </div>
        </div>
        <div className="stat-card photos">
          <FaImages className="stat-icon" />
          <div className="stat-content">
            <h3>{stats.totalPhotos}</h3>
            <p>Fotos Subidas</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "guests" ? "active" : ""}`}
          onClick={() => setActiveTab("guests")}
        >
          <FaUsers /> Lista de Invitados
        </button>
        <button
          className={`tab-btn ${activeTab === "scanner" ? "active" : ""}`}
          onClick={() => setActiveTab("scanner")}
        >
          <FaQrcode /> Escáner QR
        </button>
        <button
          className={`tab-btn ${activeTab === "photos" ? "active" : ""}`}
          onClick={() => setActiveTab("photos")}
        >
          <FaImages /> Galería de Fotos
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "guests" && (
          <GuestListSection guestData={guestData} />
        )}
        {activeTab === "scanner" && (
          <ScannerSection />
        )}
        {activeTab === "photos" && (
          <PhotoGallerySection photos={photos} />
        )}
      </div>
    </div>
  );
}

// Guest List Section Component
function GuestListSection({ guestData }) {
  const [filter, setFilter] = useState("confirmed");
  const [selectedGuest, setSelectedGuest] = useState(null);

  const currentList = guestData[filter] || [];

  return (
    <div className="guest-section">
      <div className="section-filters">
        <button
          className={`filter-btn ${filter === "confirmed" ? "active" : ""}`}
          onClick={() => setFilter("confirmed")}
        >
          Confirmados ({guestData.confirmed.length})
        </button>
        <button
          className={`filter-btn ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Sin Respuesta ({guestData.pending.length})
        </button>
        <button
          className={`filter-btn ${filter === "declined" ? "active" : ""}`}
          onClick={() => setFilter("declined")}
        >
          No Asistirán ({guestData.declined.length})
        </button>
      </div>

      <div className="guest-table-container">
        <table className="guest-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Pases</th>
              <th>Fecha Registro</th>
              <th>QR</th>
            </tr>
          </thead>
          <tbody>
            {currentList.map((guest) => (
              <tr key={guest.id}>
                <td className="guest-name">{guest.nombre}</td>
                <td>{guest.invitados}</td>
                <td>{new Date(guest.created_at).toLocaleDateString()}</td>
                <td>
                  {guest.qr_code ? (
                    <button
                      className="qr-link"
                      onClick={() => setSelectedGuest(guest)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      Ver QR
                    </button>
                  ) : (
                    <span className="no-qr">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {currentList.length === 0 && (
          <div className="empty-state">
            <p>No hay invitados en esta categoría</p>
          </div>
        )}
      </div>

      {/* QR Modal */}
      {selectedGuest && (
        <div className="lightbox" onClick={() => setSelectedGuest(null)}>
          <div className="lightbox-content qr-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelectedGuest(null)}>×</button>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'Catchy Mager, cursive', color: '#A68A5F', marginBottom: '20px' }}>
                Código QR
              </h2>
              <QRDisplay value={selectedGuest.qr_code} />
              <div style={{ marginTop: '20px', textAlign: 'left', background: '#F5F1E8', padding: '20px', borderRadius: '12px' }}>
                <p style={{ margin: '8px 0' }}><strong>Nombre:</strong> <span style={{ textTransform: 'capitalize' }}>{selectedGuest.nombre}</span></p>
                <p style={{ margin: '8px 0' }}><strong>Pases:</strong> {selectedGuest.invitados}</p>
                <p style={{ margin: '8px 0' }}><strong>Fecha de registro:</strong> {new Date(selectedGuest.created_at).toLocaleDateString()}</p>
                <p style={{ margin: '8px 0' }}><strong>Estado:</strong> {selectedGuest.asistira ? '✅ Confirmado' : '❌ No confirmado'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Scanner Section Component
function ScannerSection() {
  return (
    <div className="scanner-section">
      <div className="scanner-container">
        <h2>Escanear Código QR</h2>
        <p>Usa la cámara para escanear los códigos QR de los invitados</p>
        <QRScanner />
      </div>
    </div>
  );
}

// Photo Gallery Section Component
function PhotoGallerySection({ photos }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <div className="photo-section">
      <div className="photo-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-card" onClick={() => setSelectedPhoto(photo)}>
            <img src={photo.url} alt="Foto de boda" />
            <div className="photo-info">
              <p className="photo-uploader">
                {photo.invitado?.nombre || "Anónimo"}
              </p>
              <p className="photo-date">
                {photo.creado_en ? new Date(photo.creado_en).toLocaleDateString() : 'Fecha no disponible'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {photos.length === 0 && (
        <div className="empty-state">
          <FaImages size={48} />
          <p>Aún no hay fotos subidas</p>
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <div className="lightbox" onClick={() => setSelectedPhoto(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelectedPhoto(null)}>×</button>
            <img src={selectedPhoto.url} alt="Foto ampliada" />
            <div className="lightbox-info">
              <p><strong>Subido por:</strong> {selectedPhoto.invitado?.nombre || "Anónimo"}</p>
              <p><strong>Fecha:</strong> {selectedPhoto.creado_en ? new Date(selectedPhoto.creado_en).toLocaleString() : 'No disponible'}</p>
              <p><strong>Tamaño:</strong> {selectedPhoto.size_mb?.toFixed(2)} MB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
