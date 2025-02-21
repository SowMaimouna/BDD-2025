import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ numElecteur: "", numCNI: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/login-elector", formData);
      if (res.data.success) {
        console.log("Données envoyées à VerifyOTP:", res.data.elector);
        navigate("/verify-otp", { state: { ...res.data.elector, numElecteur: formData.numElecteur } });
      } else {
        alert("Numéro d’électeur ou CNI incorrect.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de connexion.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input name="numElecteur" placeholder="Numéro d’électeur" onChange={handleChange} required />
        <input name="numCNI" placeholder="Numéro CNI" onChange={handleChange} required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
