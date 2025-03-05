import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../services/api";

const VerifyParrainage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { numElecteur, candidat } = location.state || {};

  useEffect(() => {
    console.log("Données reçues dans VerifyParrainage:", location.state);
  }, [location.state]);

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/verify-parrainage", { numElecteur, candidatId: candidat.id, code });
      if (res.data.success) {
        setMessage("Parrainage validé avec succès !");
        setTimeout(() => {
          navigate("/parrainageValide"); // Redirige après validation
        }, 2000);
      } else {
        setMessage("Code incorrect. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur de validation:", error);
      setMessage("Erreur lors de la validation du code. Veuillez réessayer.");
    }
  };

  if (!location.state) {
    return <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md">Erreur : Aucune donnée reçue.</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Vérification du Parrainage</h2>
      <p><strong>Candidat :</strong> {candidat.nom} {candidat.prenom}</p>
      {message && <p className="text-red-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Code d’authentification" 
          value={code} 
          onChange={handleChange} 
          required 
          className="border p-2 rounded w-full mb-4"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">Valider</button>
      </form>
    </div>
  );
};

export default VerifyParrainage;
