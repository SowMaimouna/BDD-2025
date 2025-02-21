import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../services/api";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { numElecteur, nom, prenom, date_naissance, bureau_vote } = location.state || {};

  // DEBUG: Affiche les données reçues
  useEffect(() => {
    console.log("Données reçues dans VerifyOTP:", location.state);
  }, [location.state]);

  const [code, setCode] = useState("");

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/verify-otp", { numElecteur, code });
      if (res.data.success) {
        alert("Connexion réussie !");
        navigate("/dashboard"); // Redirige vers le tableau de bord
      } else {
        alert("Code incorrect.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de validation.");
    }
  };

  if (!location.state) {
    return <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md">Erreur : Aucune donnée reçue.</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Vérification</h2>
      <p><strong>Nom :</strong> {nom}</p>
      <p><strong>Prénom :</strong> {prenom}</p>
      <p><strong>Date de naissance :</strong> {date_naissance}</p>
      <p><strong>Bureau de vote :</strong> {bureau_vote}</p>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Code d’authentification" value={code} onChange={handleChange} required />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Valider</button>
      </form>
    </div>
  );
};

export default VerifyOTP;
