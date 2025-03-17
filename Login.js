// import "./Login.css";
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate(); // Pour rediriger après connexion

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setErrorMessage(""); // Réinitialiser l'erreur

//     try {
//       const response = await axios.post("http://localhost:5000/login", {
//         username,
//         password,
//       });

//       // Stocker le token d'authentification
//       localStorage.setItem("token", response.data.token);

//       // Rediriger vers la page d'importation après connexion
//       navigate("/upload");
//     } catch (error) {
//       setErrorMessage("Nom d'utilisateur ou mot de passe incorrect !");
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Connexion Admin</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           type="text"
//           placeholder="Nom d'utilisateur"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Mot de passe"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Se connecter</button>
//       </form>
//       {errorMessage && <p className="error-message">{errorMessage}</p>}
//     </div>
//   );
// };

// export default Login;

















import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Fonction pour gérer la connexion
  const handleLogin = async () => {
    setErrorMessage(""); // Réinitialiser le message d'erreur

    if (!username || !password) {
      setErrorMessage("Veuillez remplir tous les champs !");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", { username, password });

      // Enregistrer le token JWT dans le stockage local
      localStorage.setItem("token", response.data.token);

      // Rediriger l'utilisateur vers la page d'importation du fichier CSV
      navigate("/upload");
    } catch (error) {
      setErrorMessage("Nom d'utilisateur ou mot de passe incorrect !");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Connexion Admin</h2>
        <div className="input-group">
          <label>Nom d'utilisateur</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Entrez votre nom d'utilisateur"
          />
        </div>
        <div className="input-group">
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
          />
        </div>
        <button className="button" onClick={handleLogin}>Se connecter</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Login;

