import React, { useState, useEffect } from "react";

const ParrainagePeriod = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);

  const validateDates = () => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      setError("La date de début doit être avant la date de fin.");
      return false;
    }

    const sixMonthsLater = new Date(today);
    sixMonthsLater.setMonth(today.getMonth() + 6);

    if (start < sixMonthsLater) {
      setError(
        "La date de début doit être au moins 6 mois après la date actuelle."
      );
      return false;
    }
    setError("");
    return true;
  };

  const handleSaveDates = () => {
    if (validateDates()) {
      console.log("Dates enregistrées :", { startDate, endDate });

      const today = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (today >= start && today <= end) {
        setIsPeriodOpen(true);
      } else {
        setIsPeriodOpen(false);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (today >= start && today <= end) {
        setIsPeriodOpen(true);
      } else {
        setIsPeriodOpen(false);
      }
    }, 86400000);

    return () => clearInterval(interval);
  }, [startDate, endDate]);

  return (
    <div>
      <h2>Ouverture de la Période de Parrainage</h2>

      {/* Formulaire pour saisir les dates */}
      <div>
        <label>Date de début :</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div>
        <label>Date de fin :</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Bouton pour enregistrer les dates */}
      <button onClick={handleSaveDates}>Enregistrer les Dates</button>

      {/* Affichage des erreurs */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Affichage de l'état de la période */}
      {isPeriodOpen ? (
        <p style={{ color: "green" }}>La période de parrainage est ouverte.</p>
      ) : (
        <p style={{ color: "red" }}>La période de parrainage est fermée.</p>
      )}
    </div>
  );
};

export default ParrainagePeriod;
