import { useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { FaCamera, FaImages, FaVideo, FaCloudUploadAlt } from "react-icons/fa";
import { MdAddAPhoto } from "react-icons/md";

export default function SharePhotos({ guestId, guestName }) {
    console.log("SharePhotos: Render with props", { guestId, guestName });

    const [uploading, setUploading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Refs for file inputs
    const cameraInputRef = useRef(null);
    const galleryInputRef = useRef(null);

    /* 📤 UPLOAD LOGIC */
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        console.log("SharePhotos: handleFileUpload guestId check", guestId);

        // 1. Validar si el usuario ha confirmado asistencia
        if (!guestId) {
            alert("🔒 Para subir fotos, primero debes confirmar tu asistencia en la sección de abajo.");
            document.getElementById("confirmacion")?.scrollIntoView({ behavior: "smooth" });
            return;
        }

        setUploading(true);
        setShowModal(false);

        try {
            const guestIdInt = parseInt(guestId, 10);
            console.log("Verifying limit for guest ID:", guestIdInt);

            // 2. Verificar límite de 50 fotos
            const { count, error: countError } = await supabase
                .from("imagenes_boda")
                .select("id", { count: "exact", head: true })
                .eq("invitado_id", guestIdInt);

            if (countError) {
                console.error("Count Error:", countError);
                throw countError;
            }

            if (count >= 50) {
                alert("🚫 Has alcanzado el límite de 50 fotos permitidas por invitado.");
                setUploading(false);
                return;
            }

            // 3. Subir al Storage
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}_${guestIdInt}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: storageError } = await supabase.storage
                .from("boda-imagenes")
                .upload(filePath, file);

            if (storageError) throw storageError;

            // 4. Obtener URL Pública
            const { data: { publicUrl } } = supabase.storage
                .from("boda-imagenes")
                .getPublicUrl(filePath);

            // 5. Guardar en Base de Datos
            console.log("Attempting to insert into DB:", {
                url: publicUrl,
                size_mb: file.size / 1024 / 1024,
                invitado_id: guestIdInt
            });

            const { data: insertedData, error: dbError } = await supabase
                .from("imagenes_boda")
                .insert([
                    {
                        url: publicUrl,
                        size_mb: file.size / 1024 / 1024,
                        invitado_id: guestIdInt // ✅ Asociado al invitado
                    }
                ])
                .select();

            console.log("DB Insert result:", insertedData);
            console.log("DB Insert error:", dbError);

            if (dbError) throw dbError;

            alert("¡Foto subida con éxito! Gracias por compartir este momento.");

        } catch (error) {
            console.error("Error uploading:", error);
            alert(`Hubo un error al subir la foto: ${error.message || "Desconocido"}`);
        } finally {
            setUploading(false);
        }
    };

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
                    fontFamily: "'Cormorant Garamond', serif",
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
                <p style={{
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
                    sube y comparte con nosotros tus registros de fotos y videos en nuestro álbum de bodas colaborativo:
                </p>

                {/* BOTONES */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>

                    {/* 1️⃣ BOTÓN FOTOS (Abre Modal) */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-share"
                        disabled={uploading}
                        style={{
                            background: "#A68A5F",
                            color: "white",
                            border: "none",
                            padding: "15px 40px",
                            borderRadius: "50px",
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            cursor: "pointer",
                            boxShadow: "0 6px 20px rgba(166, 138, 95, 0.3)",
                            transition: "all 0.3s ease"
                        }}
                    >
                        {uploading ? "Subiendo..." : "Sube tus fotografías"} <FaImages />
                    </button>

                    {/* 2️⃣ BOTÓN VIDEOS (OneDrive) */}
                    <a
                        href="https://onedrive.live.com/" // TODO: USER MUST UPDATE THIS LINK
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-share"
                        style={{
                            background: "transparent",
                            color: "#A68A5F",
                            border: "2px solid #A68A5F",
                            padding: "12px 35px",
                            borderRadius: "50px",
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            textDecoration: "none",
                            transition: "all 0.3s ease"
                        }}
                    >
                        Sube tus videos <FaVideo />
                    </a>

                </div>

            </div>

            {/* 🟢 MODAL SELECCIÓN (Cámara vs Galería) */}
            {showModal && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.6)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 10000
                }} onClick={() => setShowModal(false)}>

                    <div style={{
                        background: "#fff",
                        padding: "30px",
                        borderRadius: "20px",
                        textAlign: "center",
                        maxWidth: "90%",
                        width: "350px"
                    }} onClick={(e) => e.stopPropagation()}>

                        <h3 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "1.5rem",
                            marginBottom: "25px",
                            color: "var(--color-primary)"
                        }}>
                            ¿Cómo quieres subir tu foto?
                        </h3>

                        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>

                            {/* Opción Cámara */}
                            <button onClick={() => cameraInputRef.current.click()} style={modalBtnStyle}>
                                <div style={iconContainerStyle}><MdAddAPhoto size={30} /></div>
                                <span>Cámara</span>
                            </button>

                            {/* Opción Galería */}
                            <button onClick={() => galleryInputRef.current.click()} style={modalBtnStyle}>
                                <div style={iconContainerStyle}><FaImages size={30} /></div>
                                <span>Galería</span>
                            </button>

                        </div>

                        <button
                            onClick={() => setShowModal(false)}
                            className="rsvp-btn"
                            style={{
                                marginTop: "20px",
                                background: "#8c8c8c",
                                color: "white",
                                width: "100%",
                                padding: "12px",
                                border: "none",
                                borderRadius: "50px",
                                cursor: "pointer",
                                fontFamily: "'Catchy Mager', cursive",
                                letterSpacing: "1px"
                            }}
                        >
                            Cancelar
                        </button>

                    </div>
                </div>
            )}

            {/* INPUTS OCULTOS */}
            <input
                type="file"
                accept="image/*"
                capture="environment" // Forces camera
                ref={cameraInputRef}
                style={{ display: "none" }}
                onChange={handleFileUpload}
            />
            <input
                type="file"
                accept="image/*"
                ref={galleryInputRef}
                style={{ display: "none" }}
                onChange={handleFileUpload}
            />

        </section>
    );
}

// Estilos rápidos para el modal
const modalBtnStyle = {
    flex: 1,
    background: "var(--color-bg-secondary)",
    border: "1px solid var(--color-beige)",
    borderRadius: "15px",
    padding: "20px 10px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    fontFamily: "'Montserrat', sans-serif",
    color: "var(--color-primary)"
};

const iconContainerStyle = {
    color: "#A68A5F",
    marginBottom: "5px"
};
