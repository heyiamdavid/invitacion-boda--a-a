import { FaCamera, FaGoogleDrive } from "react-icons/fa";

export default function SharePhotos({ guestId, guestName }) {
    return (
        <section id="comparte" className="section fade-in-section paper-bg-clean" style={{ paddingBottom: "60px" }}>
            <div className="section-content text-center" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>

                {/* 📷 ICONO SUPERIOR */}
                <div style={{
                    width: "80px",
                    height: "80px",
                    margin: "0 auto 20px",
                    border: "2px solid #A68A5F",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#A68A5F",
                    fontSize: "2rem"
                }}>
                    <FaCamera />
                </div>

                {/* TITULARES */}
                <h2 style={{
                    fontFamily: "'TTNorms', sans-serif",
                    fontSize: "2.5rem",
                    letterSpacing: "3px",
                    color: "#A68A5F",
                    marginBottom: "0",
                    textTransform: "uppercase"
                }}>
                    COMPARTE
                </h2>
                <p style={{
                    fontFamily: "'Catchy Mager', cursive",
                    fontSize: "3.5rem",
                    color: "#A68A5F",
                    marginTop: "-10px",
                    marginBottom: "20px"
                }}>
                    Tus fotos
                </p>

                {/* DESCRIPCIÓN */}
                <p className="font-cormorant" style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "1.1rem",
                    color: "var(--color-primary)",
                    lineHeight: "1.6",
                    marginBottom: "40px",
                    padding: "0 20px"
                }}>
                    {guestName ?
                        <span style={{ fontWeight: "600", color: "#A68A5F" }}>Hola {guestName}, </span>
                        : ""
                    }
                    queremos conservar cada instante de este día. Sube tus fotos y videos a nuestra carpeta compartida de Google Drive:
                </p>

                {/* BOTÓN PRINCIPAL */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
                    <a
                        href="https://drive.google.com/drive/folders/1zh6O9A5vmaGAkxlndNKIvH056YA-IFEt?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-share"
                        style={{
                            background: "#A68A5F",
                            color: "white",
                            border: "none",
                            padding: "15px 40px",
                            borderRadius: "50px",
                            fontFamily: "'TTNorms', sans-serif",
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            cursor: "pointer",
                            textDecoration: "none",
                            boxShadow: "0 6px 20px rgba(166, 138, 95, 0.3)",
                            transition: "all 0.3s ease"
                        }}
                    >
                        Subir fotos y videos <FaGoogleDrive />
                    </a>
                </div>
            </div>
        </section>
    );
}

