import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Avatar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function CandidateList() {
    const [candidats, setCandidats] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/candidats') 
            .then(response => setCandidats(response.data))
            .catch(err => {
                console.error(err);
                setError("Erreur lors de la récupération des candidats.");
            });
    }, []);

    return (
        <Grid container spacing={3} sx={{ marginTop: 2, padding: 2 }}>
            {error && <Typography color="error">{error}</Typography>}
            {candidats.map(candidat => (
                <Grid item xs={12} sm={6} md={4} key={candidat.id}>
                    <Card sx={{ textAlign: 'center', backgroundColor: candidat.couleur || '#f5f5f5' }}>
                        <Avatar 
                            src={candidat.photo || '/default-avatar.png'} 
                            sx={{ width: 100, height: 100, margin: 'auto', marginTop: 20 }} 
                        />
                        <CardContent>
                            <Typography variant="h6">{candidat.nom} {candidat.prenom}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {candidat.slogan || "Aucun slogan"}
                            </Typography>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                component={Link} 
                                to={`/parrainage/${candidat.id}`}  
                                sx={{ marginTop: 2 }}
                            >
                                Parrainer
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

export default CandidateList;
