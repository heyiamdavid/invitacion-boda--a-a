import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import QRScanner from "./QRScanner";
import QRDisplay from "./QRDisplay";
import { FaUsers, FaQrcode, FaImages, FaUserCheck, FaUserTimes, FaUserClock, FaDownload, FaCheckSquare, FaSquare, FaCheckCircle } from "react-icons/fa";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "../styles/admin.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("guests");
  const [guestData, setGuestData] = useState({
    confirmed: [],
    pending: [],
    declined: [],
    attended: []
  });
  const [photos, setPhotos] = useState([]);
  const [stats, setStats] = useState({
    totalConfirmed: 0,
    totalPasses: 0,
    totalDeclined: 0,
    totalPhotos: 0,
    totalCheckedIn: 0
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
    const attended = data.filter(g => g.asistio === true);

    const totalPasses = confirmed.reduce((sum, g) => sum + g.invitados, 0);

    setGuestData({ confirmed, pending, declined, attended });
    setStats({
      totalConfirmed: confirmed.length,
      totalPasses,
      totalDeclined: declined.length,
      totalPhotos: 0, // Will be updated by fetchPhotos
      totalCheckedIn: attended.length
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
        
        <div className="stat-card attended" style={{ borderLeft: "4px solid #4CAF50" }}>
          <FaCheckCircle className="stat-icon" style={{ color: "#4CAF50" }} />
          <div className="stat-content">
            <h3>{stats.totalCheckedIn}</h3>
            <p>Ya Asistieron</p>
            <span className="stat-detail">Hicieron Check-in</span>
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
          className={`filter-btn ${filter === "attended" ? "active" : ""}`}
          onClick={() => setFilter("attended")}
          style={{ borderBottom: filter === "attended" ? "2px solid #4CAF50" : "none", color: filter === "attended" ? "#4CAF50" : "inherit" }}
        >
          Asistieron ({guestData.attended.length})
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
              <th>Estado</th>
              <th>Fecha Registro</th>
              <th>QR</th>
            </tr>
          </thead>
          <tbody>
            {currentList.map((guest) => {
              // Extract n2 from qr_code if available
              let n2 = "";
              if (guest.qr_code && guest.qr_code.includes("&n2=")) {
                 n2 = decodeURIComponent(guest.qr_code.split("&n2=")[1]);
              }
              
              return (
              <tr key={guest.id} style={{ backgroundColor: guest.asistio ? "rgba(76, 175, 80, 0.1)" : "transparent" }}>
                <td className="guest-name">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span><strong>1:</strong> {guest.nombre}</span>
                        {n2 && <span style={{ fontSize: '0.85rem', color: '#666' }}><strong>2:</strong> {n2}</span>}
                    </div>
                </td>
                <td>{guest.invitados}</td>
                <td>
                    {guest.asistio ? (
                        <span style={{ color: "green", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}>
                            <FaCheckCircle /> Checked-in
                        </span>
                    ) : (
                        <span style={{ color: "#666" }}>Pendiente</span>
                    )}
                </td>
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
              );
            })}
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
                <div style={{ marginBottom: '8px' }}>
                    <strong>Nombre:</strong> 
                    <div style={{ paddingLeft: '10px', marginTop: '4px' }}>
                        <p style={{ margin: '2px 0' }}>1: <span style={{ textTransform: 'capitalize' }}>{selectedGuest.nombre}</span></p>
                        {selectedGuest.qr_code && selectedGuest.qr_code.includes("&n2=") && (
                            <p style={{ margin: '2px 0' }}>2: <span style={{ textTransform: 'capitalize' }}>
                                {decodeURIComponent(selectedGuest.qr_code.split("&n2=")[1])}
                            </span></p>
                        )}
                    </div>
                </div>
                <p style={{ margin: '8px 0' }}><strong>Pases:</strong> {selectedGuest.invitados}</p>
                <p style={{ margin: '8px 0' }}><strong>Fecha de registro:</strong> {new Date(selectedGuest.created_at).toLocaleDateString()}</p>
                <p style={{ margin: '8px 0' }}><strong>Estado:</strong> {selectedGuest.asistira ? '✅ Confirmado' : '❌ No confirmado'}</p>
                {selectedGuest.asistio && <p style={{ margin: '8px 0', color: "green", fontWeight: "bold" }}><strong>Check-in:</strong> ✅ Sí</p>}
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
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isDownloading, setIsDownloading] = useState(false);

  const toggleSelect = (e, photoId) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === photos.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(photos.map(p => p.id)));
    }
  };

  const downloadSelected = async () => {
    if (selectedIds.size === 0) return;
    setIsDownloading(true);

    try {
      const zip = new JSZip();
      const folder = zip.folder("fotos_boda");

      const downloadPromises = photos
        .filter(p => selectedIds.has(p.id))
        .map(async (photo, index) => {
          try {
            const response = await fetch(photo.url);
            const blob = await response.blob();
            const extension = photo.url.split('.').pop().split('?')[0] || 'jpg';
            const filename = `foto_${index + 1}_${photo.invitado?.nombre || 'anonimo'}.${extension}`;
            folder.file(filename, blob);
          } catch (err) {
            console.error(`Error downloading photo ${photo.url}:`, err);
          }
        });

      await Promise.all(downloadPromises);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "fotos_boda.zip");
    } catch (error) {
      console.error("Error generating ZIP:", error);
      alert("Hubo un error al generar el archivo ZIP.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="photo-section">
      {photos.length > 0 && (
        <div className="gallery-toolbar">
          <div className="toolbar-info">
            <span>{selectedIds.size} seleccionadas</span>
          </div>
          <div className="toolbar-actions">
            <button className="admin-btn-secondary" onClick={toggleSelectAll}>
              {selectedIds.size === photos.length ? "Deseleccionar Todo" : "Seleccionar Todo"}
            </button>
            <button
              className="admin-btn-primary"
              onClick={downloadSelected}
              disabled={selectedIds.size === 0 || isDownloading}
            >
              <FaDownload /> {isDownloading ? "Preparando..." : "Descargar ZIP"}
            </button>
          </div>
        </div>
      )}

      <div className="photo-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-card" onClick={() => setSelectedPhoto(photo)}>
            <div
              className={`photo-checkbox ${selectedIds.has(photo.id) ? 'checked' : ''}`}
              onClick={(e) => toggleSelect(e, photo.id)}
            >
              {selectedIds.has(photo.id) ? <FaCheckSquare /> : <FaSquare />}
            </div>
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
