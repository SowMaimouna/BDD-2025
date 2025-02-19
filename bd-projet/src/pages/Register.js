import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import './register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numElecteur: "",
    numCNI: "",
    nom: "",
    bureauVote: "",
    email: "",
    telephone: "",
    prenom: "",
  });

  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (step === 1) {
        const res = await axios.post("/verify-elector", formData);
        if (res.data.valid) {
          setStep(2);
        } else {
          alert("Informations incorrectes ou électeur introuvable.");
        }
      } else {
        const res = await axios.post("/register-elector", formData);
        if (res.data.success) {
          alert("Inscription réussie, code envoyé !");
          navigate("/login");
        } else {
          alert("Erreur lors de l'inscription.");
        }
      }
    } catch (error) {
      console.error("Erreur backend:", error);
      alert(error.response?.data?.error || "Erreur d'inscription.");
    }
  };

  return (
    <div className="container">
      <h2>Inscription des électeurs</h2>
      <form onSubmit={handleSubmit}>
        {step === 1 ? (
          <>
            <input name="numElecteur" placeholder="Numéro d’électeur" onChange={handleChange} required /> 
            <input name="numCNI" placeholder="Numéro CNI" onChange={handleChange} required />
            <input name="nom" placeholder="Nom de famille" onChange={handleChange} required />
            <input name="bureauVote" placeholder="Numéro de bureau de vote" onChange={handleChange} required />
          </>
        ) : (
          <>
            <input name="prenom" placeholder="Prénom" onChange={handleChange} required />
            <input name="email" placeholder="Adresse email" type="email" onChange={handleChange} required />
            <input name="telephone" placeholder="Numéro de téléphone" onChange={handleChange} required />
          </>
        )}
        <button type="submit">{step === 1 ? "Vérifier" : "S'inscrire"}</button>
      </form>
    </div>
  );
};

export default Register;
