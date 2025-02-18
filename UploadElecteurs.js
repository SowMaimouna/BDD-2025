import React, { useState } from "react";
import axios from "axios";
import Papa from "papaparse"; // Librairie pour lire le CSV

function UploadElecteurs() {
  const [file, setFile] = useState(null);
  const [checksum, setChecksum] = useState("");
  const [message, setMessage] = useState("");
  const [previewData, setPreviewData] = useState([]);

  // Gestion du fichier CSV
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // Lecture du fichier CSV pour affichage
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      const csv = target.result;
      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => setPreviewData(result.data),
      });
    };
    reader.readAsText(selectedFile);
  };

  // Gestion de l'upload
  const handleUpload = async () => {
    // Correction de la condition pour vérifier si fichier et checksum sont définis
    if (!file || !checksum) {
      setMessage("Veuillez sélectionner un fichier et entrer une empreinte SHA-256.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("checksum", checksum);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData);
      setMessage(response.data.message);
    } catch (error) {
      // Affichage des erreurs avec vérification de la réponse de l'API
      setMessage("Erreur lors de l'upload : " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div>
      <h2>Importer la liste des électeurs</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Empreinte SHA-256"
        value={checksum}
        onChange={(e) => setChecksum(e.target.value)}
      />
      <button onClick={handleUpload}>Uploader</button>

      {message && <p>{message}</p>}

      {/* Aperçu du fichier CSV */}
      <h3>Aperçu du fichier CSV</h3>
      <table border="1">
        <thead>
          <tr>
            {previewData.length > 0 &&
              Object.keys(previewData[0]).map((key) => <th key={key}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          {previewData.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UploadElecteurs;
