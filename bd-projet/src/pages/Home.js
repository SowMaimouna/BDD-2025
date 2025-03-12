import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const steps = [
    {
        title: "Étape 1 : Inscription",
        description: "Créez un compte en fournissant votre numéro de carte d'électeur et vos informations personnelles.",
        icon: "📝",
    },
    {
        title: "Étape 2 : Choix du candidat",
        description: "Parcourez la liste des candidats et sélectionnez celui que vous souhaitez parrainer.",
        icon: "👤",
    },
    {
        title: "Étape 3 : Validation",
        description: "Recevez un code OTP par email pour valider votre parrainage.",
        icon: "✅",
    },
];

const Home = () => {
    const navigate = useNavigate();

    return (
        <div>
            {/* 🔹 Barre de navigation fixe */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow">
                <div className="container-fluid">
                    <h1 className="navbar-brand fw-bold text-white">Gestion des parrainages</h1>
                    <div className="ms-auto">
                        <button className="btn btn-outline-light me-3 fw-bold" onClick={() => navigate("/login")}>
                            Se connecter
                        </button>
                        <button className="btn btn-light text-primary fw-bold" onClick={() => navigate("/register")}>
                            S'inscrire
                        </button>
                    </div>
                </div>
            </nav>

            {/* 🔹 Bannière d'accueil avec image à droite */}
            <header className="d-flex align-items-center justify-content-between p-5 bg-gradient shadow-lg"
                style={{
                    height: "100vh",
                    background: "linear-gradient(135deg, #0052D4, #65C7F7, #9CECFB)",
                    color: "white",
                    borderRadius: "0 0 20px 20px"
                }}
            >
                <div className="text-start" style={{ marginTop: "300px" }}>
                    <h1 className="fw-bold display-4 text-primary">Bienvenue sur la plateforme de parrainage</h1>
                    <p className="fs-5 text-primary">Facilitez votre soutien aux candidats grâce à un processus simple et sécurisé.</p>
                    <button className="btn btn-primary text-light fw-bold px-4 py-2 mt-3" onClick={() => navigate("/register")}>
                        Démarrer maintenant
                    </button>
                </div>
                <img src="./images/photo1.jpg" alt="Illustration" style={{ width: "400px", borderRadius: "10px", marginTop: "300px" }} />
            </header>

            {/* 🔹 Section "Comment parrainer" */}
            <div className="container-fluid mt-5 p-4 bg-primary text-white text-center" style={{ borderRadius: "10px" }}>
                <h2 className="fw-bold">Comment parrainer ?</h2>
                <p>Suivez ces étapes simples pour parrainer un candidat.</p>
                <div className="row justify-content-center mt-4">
                    {steps.map((step, index) => (
                        <div key={index} className="col-md-4 mb-4">
                            <div className="card h-100 bg-light text-dark p-3 shadow">
                                <div className="card-body text-center">
                                    <h3 className="card-title fw-bold">{step.title}</h3>
                                    <p className="card-text">{step.description}</p>
                                    <div className="display-4">{step.icon}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
