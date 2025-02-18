import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Avatar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function CandidateList() {
    const [candidats, setCandidats] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/api/candidats')
            .then(response => setCandidats(response.data))
            .catch(err => {
                console.error(err);
                setError("Erreur lors de la récupération des candidats.");
            });
    }, []);

    return (
        <Grid container spacing={3} sx={{ marginTop: 2 }}>
            {error && <Typography color="error">{error}</Typography>}
            {candidats.map(candidat => (
                <Grid item xs={12} sm={6} md={4} key={candidat.id}>
                    <Card sx={{ textAlign: 'center' }}>
                        <Avatar src={candidat.photo || '/default-avatar.png'} sx={{ width: 80, height: 80, margin: 'auto', marginTop: 2 }} />
                        <CardContent>
                            <Typography variant="h6">{candidat.nom} {candidat.prenom}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {candidat.parti || 'Indépendant'}
                            </Typography>
                            <Button variant="contained" color="primary" component={Link} to={`/candidats/${candidat.id}`} sx={{ marginTop: 2 }}>
                                Voir détails
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

export default CandidateList;
