import React, { useState } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import "./UploadElecteurs.css"; 

const UploadElecteurs = () => {
  const [file, setFile] = useState(null);
  const [checksum, setChecksum] = useState("");
  const [generatedChecksum, setGeneratedChecksum] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);


    const reader = new FileReader();
    reader.onload = function (e) {
      const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
      const hash = CryptoJS.SHA256(wordArray).toString();
      setGeneratedChecksum(hash);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

 
  const handleUpload = async () => {
    setMessage("");
    setErrorMessage("");

    if (!file) {
      setErrorMessage("Veuillez sélectionner un fichier CSV");
      return;
    }

    if (!checksum) {
      setErrorMessage(" Veuillez saisir l'empreinte SHA-256");
      return;
    }

    if (checksum !== generatedChecksum) {
      setErrorMessage(" Erreur : L'empreinte SHA-256 ne correspond pas !");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("checksum", checksum);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ " + response.data.message);
    } catch (error) {
      console.error(" Erreur lors de l'upload :", error);
      setErrorMessage("Erreur lors de l'envoi du fichier.");
    }
  };

  return (
    <div className="upload-container">
      <h2>Importer un fichier CSV</h2>

      <input type="file" accept=".csv" onChange={handleFileChange} />

      <div className="empreinte-container">
        <p><strong>Empreinte SHA-256 générée :</strong></p>
        <p>{generatedChecksum}</p>
      </div>

      <input
        type="text"
        placeholder="Saisissez l'empreinte SHA-256"
        value={checksum}
        onChange={(e) => setChecksum(e.target.value)}
      />

      <button onClick={handleUpload}>Importer</button>

      {message && <p className="success-message">{message}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default UploadElecteurs;
