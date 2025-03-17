import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Grid, Avatar, CircularProgress, Box } from "@mui/material";
import Parrainage from "./Parrainage";

const couleursPartis = [
    ["#FF5733", "#42A5F5", "#FFF176"], // Parti 1
    ["#CE93D8", "#C70039", "#90CAF9"], // Parti 2
    ["#43A047", "#FDD835", "#A5D6A7"], // Parti 3
    ["#66BB6A", "#FFEB3B", "#900C3F"], // Parti 4
    ["#8E24AA", "#1E88E5", "#BA68C8"], // Parti 5
    //["#E65100", "#FB8C00", "#FFB74D"], // Parti 6
];

function Dashboard() {
    const [candidats, setCandidats] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        axios.get("http://localhost:5000/candidats")
            .then(response => { 
                const candidatsAvecCouleurs = response.data.map((candidat, index) => ({
                    ...candidat,
                    couleurs: couleursPartis[index % couleursPartis.length] || ["#000", "#555", "#999"] // Valeur par défaut
                }));
    
                setCandidats(candidatsAvecCouleurs);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Erreur lors de la récupération des candidats.");
                setLoading(false);
            });
    }, []);
    

    return (
        <Box>
           
            <Box
                sx={{
                    background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                    padding: "20px",
                    textAlign: "center",
                    color: "white",
                    borderRadius: "0 0 20px 20px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)"
                }}
            >
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow">
                    <div className="container-fluid">
                        <Typography variant="h4"
                            fontWeight="bold"
                            style={{
                                margin: "15px 30px", // Ajoute de l'espace au-dessus et en dessous
                                overflow: "visible", // Assure que rien n'est masqué
                                whiteSpace: "normal",  // Empêche la coupure du texte
                            }}>
                            🗳️ Liste des candidats à parrainer
                        </Typography>
                    </div>
                </nav>
            
            </Box>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3} sx={{ padding: 3, display: "flex", justifyContent: "center", marginTop: 50 }}>
                    {error && <Typography color="error">{error}</Typography>}

                    {candidats.map(candidat => (
                        <Grid item xs={12} sm={6} md={4} key={candidat.id}>
                            <Card
                                sx={{
            
                                        textAlign: "center",
                                        borderRadius: "15px",
                                        transition: "0.3s",
                                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                                        "&:hover": { transform: "scale(1.05)" },
                                        width: "250px",  // Largeur fixe
                                        height: "400px", // Hauteur fixe 
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "space-between",  // Éviter que le texte étire la carte
                                        padding: "10px",
                                        margin: "10px 50px", // Ajoute un espace entre les cartes
                                        marginTop: "10px",
                                        position: "relative" // Permet d'ajouter les bandes de couleur
                                    }}
                            >
                                {/* Affichage des 3 couleurs en bandes horizontales */}
                                <Box 
                                    sx={{ 
                                        display: "flex", 
                                        width: "100%", 
                                        height: "10px", 
                                        position: "absolute", 
                                        top: 0, 
                                        left: 0 
                                    }}
                                >
                                    <Box sx={{ flex: 1, backgroundColor: candidat.couleurs[0] }} />
                                    <Box sx={{ flex: 1, backgroundColor: candidat.couleurs[1] }} />
                                    <Box sx={{ flex: 1, backgroundColor: candidat.couleurs[2] }} />
                                </Box>

                                <Avatar 
                                    src={candidat.photo || "/default-avatar.png"} 
                                    sx={{ width: 120, height: 120, margin: "auto", marginTop: 2, border: "4px solid white" }} 
                                />
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold">
                                        {candidat.nom} {candidat.prenom}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        sx={{ 
                                            fontStyle: "italic", 
                                            marginBottom: 2,
                                            maxHeight: "40px",  // Empêche le slogan de trop étirer la carte
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        }}
                                    >
                                        {candidat.slogan || "Aucun slogan"}

                                    </Typography>

                                    <Typography variant="subtitle2" fontWeight="bold" color="primary" 
                                    style={{
                                        margin: "0px 50px", // Ajoute de l'espace au-dessus et en dessous
                                        overflow: "visible", // Assure que rien n'est masqué
                                        whiteSpace: "normal",  // Empêche la coupure du texte
                                    }}>
                                        Parti : {candidat.parti || "Parti non spécifié"}
                                    </Typography> 

                                    <Parrainage candidat={candidat} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}

export default Dashboard;
