import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Grid } from '@mui/material';
import axios from 'axios';

function CandidateRegistration() {
    // step 1 : vérification du numéro de carte d’électeur
    // step 2 : affichage des infos de base et saisie des infos complémentaires
    const [step, setStep] = useState(1);
    const [numCarteElecteur, setNumCarteElecteur] = useState('');
    const [baseInfo, setBaseInfo] = useState(null); // contiendra { nom, prenom, date_naissance }
    const [error, setError] = useState('');

    // Données complémentaires à saisir
    const [complementData, setComplementData] = useState({
        email: '',
        telephone: '',
        parti: '',
        slogan: '',
        couleur1: '',
        couleur2: '',
        couleur3: '',
        urlInfo: '',
    });

    // Appel à l'API pour vérifier le numéro de carte d'électeur
    const handleVerify = async () => {
        setError('');
        try {
            // Appel de l'API de vérification
            const response = await axios.get(`http://localhost:5000/api/electeurs/check?num=${numCarteElecteur}`);
            const data = response.data;
            // On suppose que l'API renvoie un objet avec :
            // { exists: true, registered: false, nom, prenom, date_naissance } si OK
            // { exists: false } si le candidat n'est pas dans le fichier électoral
            // { exists: true, registered: true } si déjà enregistré

            if (!data.exists) {
                setError("Le candidat considéré n’est pas présent dans le fichier électoral.");
            } else if (data.registered) {
                setError("Candidat déjà enregistré !");
            } else {
                // Si tout est OK, on affiche les infos de base et passe à l'étape 2
                setBaseInfo({
                    nom: data.nom,
                    prenom: data.prenom,
                    date_naissance: data.date_naissance,
                });
                setStep(2);
            }
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la vérification. Veuillez réessayer.");
        }
    };

    // Envoi de la candidature (toutes les données)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Fusionner les données de base et complémentaires
            const fullData = {
                numCarteElecteur,
                ...baseInfo, // nom, prenom, date_naissance
                ...complementData,
            };

            const response = await axios.post('http://localhost:5000/api/candidat', fullData);
            alert("Candidat ajouté avec succès !");
            // Optionnel : réinitialiser le formulaire ou rediriger
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'enregistrement du candidat.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                {step === 1 && (
                    <>
                        <Typography variant="h5" textAlign="center" gutterBottom>
                            Vérification de l'électeur
                        </Typography>
                        <TextField
                            fullWidth
                            label="Numéro de carte d’électeur"
                            value={numCarteElecteur}
                            onChange={(e) => setNumCarteElecteur(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
                        <Button variant="contained" color="primary" fullWidth onClick={handleVerify}>
                            Vérifier
                        </Button>
                    </>
                )}

                {step === 2 && baseInfo && (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Informations de base de l’électeur
                        </Typography>
                        <Typography>Nom : {baseInfo.nom}</Typography>
                        <Typography>Prénom : {baseInfo.prenom}</Typography>
                        <Typography>Date de naissance : {baseInfo.date_naissance}</Typography>

                        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                            Informations complémentaires
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        value={complementData.email}
                                        onChange={(e) =>
                                            setComplementData({ ...complementData, email: e.target.value })
                                        }
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Téléphone"
                                        name="telephone"
                                        value={complementData.telephone}
                                        onChange={(e) =>
                                            setComplementData({ ...complementData, telephone: e.target.value })
                                        }
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Parti politique (facultatif)"
                                        name="parti"
                                        value={complementData.parti}
                                        onChange={(e) =>
                                            setComplementData({ ...complementData, parti: e.target.value })
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Slogan (facultatif)"
                                        name="slogan"
                                        value={complementData.slogan}
                                        onChange={(e) =>
                                            setComplementData({ ...complementData, slogan: e.target.value })
                                        }
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Couleur 1"
                                        name="couleur1"
                                        type="color"
                                        value={complementData.couleur1}
                                        onChange={(e) =>
                                            setComplementData({ ...complementData, couleur1: e.target.value })
                                        }
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Couleur 2"
                                        name="couleur2"
                                        type="color"
                                        value={complementData.couleur2}
                                        onChange={(e) =>
                                            setComplementData({ ...complementData, couleur2: e.target.value })
                                        }
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Couleur 3"
                                        name="couleur3"
                                        type="color"
                                        value={complementData.couleur3}
                                        onChange={(e) =>
                                            setComplementData({ ...complementData, couleur3: e.target.value })
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="URL Infos (facultatif)"
                                        name="urlInfo"
                                        value={complementData.urlInfo}
                                        onChange={(e) =>
                                            setComplementData({ ...complementData, urlInfo: e.target.value })
                                        }
                                    />
                                </Grid>
                                {error && (
                                    <Grid item xs={12}>
                                        <Typography color="error">{error}</Typography>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary" fullWidth>
                                        Enregistrer le Candidat
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </>
                )}
            </Paper>
        </Container>
    );
}

export default CandidateRegistration;
