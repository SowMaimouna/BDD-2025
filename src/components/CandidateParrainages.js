import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    Card, CardContent, Typography, List, ListItem, ListItemText,
    Avatar, ListItemAvatar, Divider, Box, CircularProgress
} from "@mui/material";

const CandidateParrainages = () => {
    const { id } = useParams();
    const [parrainages, setParrainages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/candidat/${id}/parrainages`)
            .then(response => setParrainages(response.data))
            .catch(error => console.error("Erreur lors du chargement des parrainages:", error))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Card sx={{ maxWidth: 600, width: "100%", boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
                        Parrainages reçus
                    </Typography>

                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : parrainages.length > 0 ? (
                        <List>
                            {parrainages.map((electeur, index) => (
                                <Box key={index}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: "#1976d2", color: "white" }}>
                                                {electeur.nom.charAt(0)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${electeur.nom} ${electeur.prenom}`}
                                            secondary={`Carte électeur: ${electeur.numero_carte_electeur} • Né(e) le: ${electeur.date_naissance}`}
                                        />
                                    </ListItem>
                                    {index !== parrainages.length - 1 && <Divider variant="inset" />}
                                </Box>
                            ))}
                        </List>
                    ) : (
                        <Typography align="center" color="text.secondary">
                            Aucun parrainage reçu.
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default CandidateParrainages;
