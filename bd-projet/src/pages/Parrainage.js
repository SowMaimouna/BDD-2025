import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

function Parrainage({ candidat }) {
    const [otp, setOtp] = useState("");
    const [openOtpDialog, setOpenOtpDialog] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const numElecteur = localStorage.getItem("numElecteur");

    const handleSelectCandidat = () => {
        axios.post("http://localhost:5000/send-otp", { candidatId: candidat.id, numElecteur })
            .then(() => {
                setOpenOtpDialog(true); // Affiche la boîte de dialogue
                setMessage("Un code a été envoyé à votre email !");
            })
            .catch(() => setMessage("Erreur lors de l'envoi du code."));
    };

    const handleVerifyOtp = () => {
        axios.post("http://localhost:5000/verify-parrainage", { numElecteur, candidatId: candidat.id, code: otp })
            .then((response) => {
                console.log("✅ Réponse serveur :", response.data);
    
                if (response.data.success) {
                    setMessage("Parrainage validé avec succès !");
                    setTimeout(() => {
                        navigate("/parrainageValide", { state: { success: true } });
                    }, 500); // Petit délai pour que le message apparaisse
                } else {
                    setMessage("Code incorrect, veuillez réessayer.");
                }
            })
            .catch((err) => {
                console.error("❌ Erreur :", err);
                setMessage("Vous avez déjà parrainé un candidat.");
                navigate("/parrainageValide", { state: { success: false } });
            });
    };
    

    return (
        <div>
            <Button variant="contained" color="primary" sx={{ marginTop: 5 }} onClick={handleSelectCandidat}>
                Parrainer
            </Button>

            <Dialog open={openOtpDialog} onClose={() => setOpenOtpDialog(false)}>
                <DialogTitle>Vérification du code OTP</DialogTitle>
                <DialogContent>
                    <TextField 
                        label="Code OTP" 
                        variant="outlined" 
                        fullWidth 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                    />
                    {message && <p style={{ color: "red" }}>{message}</p>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenOtpDialog(false)} color="secondary">Annuler</Button>
                    <Button onClick={handleVerifyOtp} color="primary">Valider</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Parrainage;
