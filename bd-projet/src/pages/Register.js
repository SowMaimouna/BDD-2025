import { useState } from "react";
import axios from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    numElecteur: "",
    numCNI: "",
    nom: "",
    bureauVote: "",
    email: "",
    telephone: "",
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
          alert("Informations incorrectes.");
        }
      } else {
        await axios.post("/register-elector", formData);
        alert("Inscription réussie, code envoyé !");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur d'inscription.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Inscription des électeurs</h2>
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
            <input name="email" placeholder="Adresse email" type="email" onChange={handleChange} required />
            <input name="telephone" placeholder="Numéro de téléphone" onChange={handleChange} required />
          </>
        )}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{step === 1 ? "Vérifier" : "S'inscrire"}</button>
      </form>
    </div>
  );
};

export default Register;
