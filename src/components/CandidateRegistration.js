import React, { useState } from "react";
import {
    Container, Paper, Typography, TextField, Button, Grid,
    CircularProgress, IconButton, Box
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";

function CandidateRegistration() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [numero_carte_electeur, setNumCarteElecteur] = useState("");
    const [baseInfo, setBaseInfo] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [photo, setPhoto] = useState(null);


    // Données complémentaires à saisir
    const [complementData, setComplementData] = useState({
        email: '',
        telephone: '',
        parti: '',
        slogan: '',
        couleur1: '',
        couleur2: '',
        couleur3: '',
        url: '',
    });


    const handleVerify = async () => {
        if (!numero_carte_electeur.trim()) {
            setError("Veuillez entrer un numéro de carte.");
            setOpenSnackbar(true);
            return;
        }

        setError("");
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:5000/api/electeurs/check?num=${numero_carte_electeur}`
            );
            console.log("Réponse API:", response.data); // 👈 Ajout pour voir la réponse

            const data = response.data;

            if (!data.exists) {
                setError("Le candidat n’est pas présent dans le fichier électoral.");
            } else {
                setBaseInfo({
                    nom: data.nom,
                    prenom: data.prenom,
                    date_naissance: data.date_naissance,
                });
                setStep(2);
            }
        } catch (err) {
            console.error("Erreur API:", err);
            setError("Erreur lors de la vérification. Veuillez réessayer.");
        }
        setLoading(false);
        setOpenSnackbar(true);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!complementData.email.trim() || !complementData.telephone.trim()) {
            setError("Email et téléphone sont obligatoires.");
            setOpenSnackbar(true);
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();

            // Ajouter les autres données au formulaire
            formData.append("numero_carte_electeur", numero_carte_electeur);
            Object.keys(baseInfo).forEach((key) => formData.append(key, baseInfo[key]));
            Object.keys(complementData).forEach((key) => {
                if (key !== "photo") { // On ajoute tout sauf la photo ici
                    formData.append(key, complementData[key]);
                }
            });

            // Ajouter la photo si elle est définie
            if (complementData.photo) {
                formData.append("photo", complementData.photo);
            }

            // Envoyer les données en `multipart/form-data`
            await axios.post("http://localhost:5000/api/candidat", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccess(true);
            setStep(1);
            setNumCarteElecteur("");
            setBaseInfo(null);
            setComplementData({
                email: '',
                telephone: '',
                parti: '',
                slogan: '',
                couleur1: '',
                couleur2: '',
                couleur3: '',
                url: '',
                photo: null, // Réinitialiser la photo
            });
        } catch (err) {
            setError("Erreur lors de l'enregistrement du candidat.");
        }
        setLoading(false);
        setOpenSnackbar(true);
    };


    return (
        <Container maxWidth="md">
            <Paper elevation={6} sx={{ p: 4, mt: 4, borderRadius: 3 }}>
                <Box textAlign="center" mb={2}>
                    <Typography variant="h4" fontWeight="bold">
                        {step === 1 ? "Vérification du Candidat" : "Inscription du Candidat"}
                    </Typography>
                </Box>

                {step === 1 && (
                    <Box textAlign="center">
                        <TextField
                            fullWidth
                            label="Numéro de carte d’électeur"
                            value={numero_carte_electeur}
                            onChange={(e) => setNumCarteElecteur(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleVerify}
                            disabled={loading || !numero_carte_electeur.trim()}
                            startIcon={loading && <CircularProgress size={20} color="inherit" />}
                        >
                            {loading ? "Vérification..." : "Vérifier"}
                        </Button>
                    </Box>
                )}

                {step === 2 && baseInfo && (
                    <Box>
                        <IconButton onClick={() => setStep(1)}>
                            <ArrowBack />
                        </IconButton>
                        <Typography variant="h6" gutterBottom>
                            Informations du candidat
                        </Typography>
                        <Box sx={{ backgroundColor: "#f9f9f9", padding: 2, borderRadius: 2, mb: 2 }}>
                            <Typography><strong>Nom :</strong> {baseInfo.nom || "Non disponible"}</Typography>
                            <Typography><strong>Prénom :</strong> {baseInfo.prenom || "Non disponible"}</Typography>
                            <Typography><strong>Date de naissance :</strong> {baseInfo.date_naissance?.split('T')[0] || "Non disponible"}</Typography>
                        </Box>

                        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                            Informations Complémentaires
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Email" required
                                               value={complementData.email}
                                               onChange={(e) =>
                                                   setComplementData({ ...complementData, email: e.target.value })
                                               }
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Téléphone" required
                                               value={complementData.telephone}
                                               onChange={(e) =>
                                                   setComplementData({ ...complementData, telephone: e.target.value })
                                               }
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                     <TextField fullWidth label="Parti politique (facultatif)"
                                           value={complementData.parti}
                                           onChange={(e) =>
                                               setComplementData({ ...complementData, parti: e.target.value })
                                           }
                                     />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Slogan (facultatif)"
                                          value={complementData.slogan}
                                          onChange={(e) =>
                                               setComplementData({ ...complementData, slogan: e.target.value })
                                          }
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <label>Couleur 1 :</label>
                                    <input
                                        type="color"
                                        value={complementData.couleur1}
                                        onChange={(e) =>
                                            setComplementData({ ...complementData, couleur1: e.target.value })
                                        }
                                        style={{ width: "100%", height: "40px", border: "none", cursor: "pointer" }}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <label>Couleur 2 :</label>
                                    <input
                                        type="color"
                                        value={complementData.couleur2}
                                        onChange={(e) =>
                                            setComplementData({ ...complementData, couleur2: e.target.value })
                                        }
                                        style={{ width: "100%", height: "40px", border: "none", cursor: "pointer" }}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <label>Couleur 3 :</label>
                                    <input
                                        type="color"
                                        value={complementData.couleur3}
                                        onChange={(e) =>
                                            setComplementData({ ...complementData, couleur3: e.target.value })
                                        }
                                        style={{ width: "100%", height: "40px", border: "none", cursor: "pointer" }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField fullWidth label="URL (facultatif)"
                                               value={complementData.url}
                                               onChange={(e) =>
                                                   setComplementData({ ...complementData, url: e.target.value })
                                               }
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <label>Photo du candidat :</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setComplementData({ ...complementData, photo: e.target.files[0] })}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                                        {loading ? "Enregistrement..." : "Enregistrer le Candidat"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}

export default CandidateRegistration;
