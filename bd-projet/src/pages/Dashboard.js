import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Grid, Avatar } from "@mui/material";
import Parrainage from "./Parrainage";

function Dashboard() {
    const [candidats, setCandidats] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/candidats")
            .then(response => setCandidats(response.data))
            .catch(err => {
                console.error(err);
                setError("Erreur lors de la récupération des candidats.");
            });
    }, []);

    return (
        <div>
            <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 3 }}>
                Liste des candidats
            </Typography>

            {error && <Typography color="error">{error}</Typography>}

            <Grid container spacing={3} sx={{ padding: 2 }}>
                {candidats.map(candidat => (
                    <Grid item xs={12} sm={6} md={4} key={candidat.id}>
                        <Card sx={{ textAlign: "center", backgroundColor: candidat.couleur || "#f5f5f5" }}>
                            <Avatar 
                                src={candidat.photo || "/default-avatar.png"} 
                                sx={{ width: 100, height: 100, margin: "auto", marginTop: 2 }} 
                            />
                            <CardContent>
                                <Typography variant="h6">{candidat.nom} {candidat.prenom}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {candidat.slogan || "Aucun slogan"}
                                </Typography>
                                <Parrainage candidat={candidat} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default Dashboard;
