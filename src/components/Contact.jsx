import { FaWhatsapp } from "react-icons/fa";

export default function Contact() {
    return (
        <section id="dudas" className="section fade-in-section paper-bg-clean" style={{ paddingBottom: "10px" }}>
            <div className="section-content" style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>

                {/* Título Serif */}
                <h2 className="catchy-mager" style={{
                    fontFamily: "'Catchy Mager', cursive",
                    fontSize: "3rem",
                    color: "var(--color-primary)",
                    marginBottom: "10px",
                    letterSpacing: "2px"
                }}>
                    ¿DUDAS?
                </h2>

                {/* Subtítulo */}
                <p style={{
                    fontFamily: "'Catchy Mager', cursive",
                    fontSize: "1.2rem",
                    color: "var(--color-primary)",
                    marginBottom: "40px",
                    opacity: 0.9
                }}>
                    Habla con los novios:
                </p>

                {/* Botones */}
                <div className="contact-buttons" style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    flexWrap: "wrap",
                    marginBottom: "0px"
                }}>
                    <a
                        href="http://wa.me/+593988579548" // TODO: Update with real number or leave generic
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-contact"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "10px",
                            background: "#A68A5F", /* Gold/Bronze tone from image */
                            color: "#fff",
                            padding: "15px 30px",
                            borderRadius: "50px",
                            textDecoration: "none",
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            letterSpacing: "1px",
                            boxShadow: "0 4px 15px rgba(166, 138, 95, 0.4)",
                            transition: "transform 0.3s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                        Whatsapp Novio <FaWhatsapp size={24} />
                    </a>

                    <a
                        href="http://wa.me/+593960137095"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-contact"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "10px",
                            background: "#A68A5F",
                            color: "#fff",
                            padding: "15px 30px",
                            borderRadius: "50px",
                            textDecoration: "none",
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            letterSpacing: "1px",
                            boxShadow: "0 4px 15px rgba(166, 138, 95, 0.4)",
                            transition: "transform 0.3s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                        Whatsapp Novia <FaWhatsapp size={24} />
                    </a>
                </div>

            </div>
        </section>
    );
}
