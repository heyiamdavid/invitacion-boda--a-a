import { useState, useRef, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { FaCamera, FaImages, FaVideo, FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";
import { MdAddAPhoto } from "react-icons/md";

export default function SharePhotos({ guestId, guestName }) {
    console.log("SharePhotos: Render with props", { guestId, guestName });

    const [uploading, setUploading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [pendingFiles, setPendingFiles] = useState([]);
    const [selectedIndices, setSelectedIndices] = useState(new Set());
    const [showPreview, setShowPreview] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Refs for file inputs
    const cameraInputRef = useRef(null);
    const galleryInputRef = useRef(null);

    // Cleanup object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            pendingFiles.forEach(fileObj => URL.revokeObjectURL(fileObj.preview));
        };
    }, [pendingFiles]);

    /* 📂 FILE SELECTION HANDLING */
    const handleFileSelection = (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        // Validar si el usuario ha confirmado asistencia
        if (!guestId) {
            alert("🔒 Para subir fotos, primero debes confirmar tu asistencia en la sección de abajo.");
            document.getElementById("confirmacion")?.scrollIntoView({ behavior: "smooth" });
            return;
        }

        // Limit to 10 files
        let filesToProcess = files;
        if (files.length > 10) {
            alert("⚠️ Solo puedes seleccionar un máximo de 10 imágenes a la vez.");
            filesToProcess = files.slice(0, 10);
        }

        const newPendingFiles = filesToProcess.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            name: file.name
        }));

        setPendingFiles(newPendingFiles);
        setSelectedIndices(new Set(newPendingFiles.map((_, i) => i)));
        setShowPreview(true);
        setShowModal(false);

        // Reset inputs to allow same file selection
        event.target.value = '';
    };

    const toggleFileSelection = (index) => {
        const newSelected = new Set(selectedIndices);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedIndices(newSelected);
    };

    /* 📤 UPLOAD LOGIC */
    const handleBatchUpload = async () => {
        const filesToUpload = pendingFiles.filter((_, i) => selectedIndices.has(i));

        if (filesToUpload.length === 0) {
            alert("Por favor, selecciona al menos una imagen para subir.");
            return;
        }

        setUploading(true);
        setShowPreview(false);
        setUploadProgress(0);

        try {
            const guestIdInt = parseInt(guestId, 10);

            // Verificar límite total de 50 fotos
            const { count, error: countError } = await supabase
                .from("imagenes_boda")
                .select("id", { count: "exact", head: true })
                .eq("invitado_id", guestIdInt);

            if (countError) throw countError;

            if (count + filesToUpload.length > 50) {
                alert(`🚫 No puedes subir estas fotos. Superarías el límite de 50 fotos (tienes ${count} subidas).`);
                setUploading(false);
                setShowPreview(true);
                return;
            }

            let completed = 0;
            for (const fileObj of filesToUpload) {
                const { file } = fileObj;

                // 1. Subir al Storage
                const fileExt = file.name.split(".").pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${guestIdInt}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: storageError } = await supabase.storage
                    .from("boda-imagenes")
                    .upload(filePath, file);

                if (storageError) throw storageError;

                // 2. Obtener URL Pública
                const { data: { publicUrl } } = supabase.storage
                    .from("boda-imagenes")
                    .getPublicUrl(filePath);

                // 3. Guardar en Base de Datos
                const { error: dbError } = await supabase
                    .from("imagenes_boda")
                    .insert([
                        {
                            url: publicUrl,
                            size_mb: file.size / 1024 / 1024,
                            invitado_id: guestIdInt
                        }
                    ]);

                if (dbError) {
                    // Check for foreign key error
                    if (dbError.code === "23503") {
                        localStorage.removeItem("boda_guest_id");
                        localStorage.removeItem("boda_guest_name");
                        window.location.reload(); // Force refresh to clear state
                        throw new Error("Tu sesión ha expirado o es inválida. Por favor, vuelve a confirmar tu asistencia.");
                    }
                    throw dbError;
                }

                completed++;
                setUploadProgress(Math.round((completed / filesToUpload.length) * 100));
            }

            // Success
            setPendingFiles([]);
            setSelectedIndices(new Set());
            setShowSuccessModal(true);

        } catch (error) {
            console.error("Error uploading:", error);
            alert(`Hubo un error al subir las fotos: ${error.message || "Desconocido"}`);
            setShowPreview(true);
        } finally {
            setUploading(false);
        }
    };

    const resetFlow = () => {
        setShowSuccessModal(false);
        setShowPreview(false);
        setPendingFiles([]);
        setSelectedIndices(new Set());
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
                    sube y comparte con nosotros tus registros de fotos y videos en nuestro álbum de bodas colaborativo (máx. 10 por tanda):
                </p>

                {/* BOTONES PRINCIPALES */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
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
                        {uploading ? `Subiendo... ${uploadProgress}%` : "Sube tus fotografías"} <FaImages />
                    </button>

                    <a
                        href="https://onedrive.live.com/"
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
                <div style={modalOverlayStyle} onClick={() => setShowModal(false)}>
                    <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                        <h3 style={modalTitleStyle}>¿Cómo quieres subir tus fotos?</h3>
                        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                            <button onClick={() => cameraInputRef.current.click()} style={modalBtnStyle}>
                                <div style={iconContainerStyle}><MdAddAPhoto size={30} /></div>
                                <span>Cámara</span>
                            </button>
                            <button onClick={() => galleryInputRef.current.click()} style={modalBtnStyle}>
                                <div style={iconContainerStyle}><FaImages size={30} /></div>
                                <span>Galería</span>
                            </button>
                        </div>
                        <button onClick={() => setShowModal(false)} className="rsvp-btn" style={cancelBtnStyle}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* 🟡 MODAL VISTA PREVIA Y SELECCIÓN */}
            {showPreview && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalContentStyle, width: "90%", maxWidth: "500px" }} onClick={(e) => e.stopPropagation()}>
                        <h3 style={modalTitleStyle}>Vista previa ({selectedIndices.size} seleccionadas)</h3>
                        <p style={{ fontSize: "0.9rem", marginBottom: "15px", color: "#666" }}>Marca las fotos que deseas subir</p>

                        <div style={previewGridStyle}>
                            {pendingFiles.map((fileObj, index) => (
                                <div
                                    key={index}
                                    style={{
                                        ...previewItemStyle,
                                        border: selectedIndices.has(index) ? "3px solid #A68A5F" : "3px solid transparent",
                                        opacity: selectedIndices.has(index) ? 1 : 0.6
                                    }}
                                    onClick={() => toggleFileSelection(index)}
                                >
                                    <img src={fileObj.preview} alt="preview" style={previewImgStyle} />
                                    <div style={{
                                        ...checkboxStyle,
                                        background: selectedIndices.has(index) ? "#A68A5F" : "rgba(255,255,255,0.8)"
                                    }}>
                                        {selectedIndices.has(index) && <FaCheckCircle color="white" />}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                            <button
                                onClick={handleBatchUpload}
                                style={{ ...submitBtnStyle, flex: 2 }}
                                disabled={selectedIndices.size === 0}
                            >
                                Subir {selectedIndices.size} {selectedIndices.size === 1 ? "foto" : "fotos"}
                            </button>
                            <button onClick={() => { setShowPreview(false); setPendingFiles([]); }} style={{ ...cancelBtnStyle, flex: 1, marginTop: 0 }}>
                                Atrás
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ MODAL ÉXITO */}
            {showSuccessModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                        <div style={{ color: "#7BB97B", fontSize: "4rem", marginBottom: "15px" }}>
                            <FaCheckCircle />
                        </div>
                        <h3 style={modalTitleStyle}>¡Gracias por subir tus imágenes!</h3>
                        <p style={{ fontFamily: "'Montserrat', sans-serif", marginBottom: "25px" }}>Tu aporte hace este día aún más especial.</p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <button
                                onClick={() => { setShowSuccessModal(false); setShowModal(true); }}
                                style={submitBtnStyle}
                            >
                                <FaCloudUploadAlt /> Seguir subiendo
                            </button>
                            <button onClick={resetFlow} style={cancelBtnStyle}>
                                Volver al inicio
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* INPUTS OCULTOS */}
            <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={cameraInputRef}
                style={{ display: "none" }}
                onChange={handleFileSelection}
                multiple
            />
            <input
                type="file"
                accept="image/*"
                ref={galleryInputRef}
                style={{ display: "none" }}
                onChange={handleFileSelection}
                multiple
            />

        </section>
    );
}

// ESTILOS
const modalOverlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
    padding: "20px"
};

const modalContentStyle = {
    background: "#fff",
    padding: "30px",
    borderRadius: "24px",
    textAlign: "center",
    width: "350px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    maxHeight: "90vh",
    overflowY: "auto"
};

const modalTitleStyle = {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1.6rem",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#A68A5F"
};

const modalBtnStyle = {
    flex: 1,
    background: "var(--color-bg-secondary)",
    border: "1px solid var(--color-beige)",
    borderRadius: "20px",
    padding: "25px 10px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    fontFamily: "'Montserrat', sans-serif",
    color: "var(--color-primary)",
    transition: "all 0.2s ease"
};

const iconContainerStyle = {
    color: "#A68A5F",
    marginBottom: "5px"
};

const previewGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: "10px",
    maxHeight: "300px",
    overflowY: "auto",
    padding: "5px",
    marginBottom: "20px"
};

const previewItemStyle = {
    position: "relative",
    aspectRatio: "1",
    borderRadius: "12px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.2s ease"
};

const previewImgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover"
};

const checkboxStyle = {
    position: "absolute",
    top: "5px",
    right: "5px",
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
};

const submitBtnStyle = {
    background: "#A68A5F",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "50px",
    cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: "600",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%"
};

const cancelBtnStyle = {
    marginTop: "10px",
    background: "#f0f0f0",
    color: "#666",
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: "600"
};
