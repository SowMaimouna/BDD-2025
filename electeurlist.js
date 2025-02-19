import React, { useState, useEffect } from 'react';

const ElecteursList = () => {
  const [electeurs, setElecteurs] = useState([]);

  useEffect(() => {
    // Appel à l'API pour récupérer les électeurs
    fetch('http://localhost:5000/electeurs')
      .then(response => response.json())
      .then(data => setElecteurs(data))
      .catch(error => console.error('Erreur lors de la récupération des électeurs', error));
  }, []);

  return (
    <div>
      <h2>Liste des électeurs importés</h2>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Numéro Carte Identité</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {electeurs.map((electeur) => (
            <tr key={electeur.id}>
              <td>{electeur.nom}</td>
              <td>{electeur.numero_carte_identite}</td>
              <td>{electeur.statut_import}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ElecteursList;
