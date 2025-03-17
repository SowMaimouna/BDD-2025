import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Avatar, Button, Box, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';

function CandidateList() {
    const [candidat, setCandidat] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/api/candidat')
            .then(response => {
                setCandidat(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Erreur lors de la récupération des candidats.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f3f4f6 30%, #e0e7ff 100%)',
            padding: 3
        }}>
            <Typography variant="h4" align="center" fontWeight="bold" mb={3}>
                Liste des Candidats
            </Typography>

            {error && <Typography color="error" align="center">{error}</Typography>}

            <Grid container spacing={3} justifyContent="center">
                {candidat.length > 0 ? (
                    candidat.map(candidat => (
                        <Grid item xs={12} sm={6} md={4} key={candidat.numero_carte_electeur}>
                            <Card sx={{
                                textAlign: 'center',
                                padding: 2,
                                borderRadius: 3,
                                boxShadow: 5,
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': { transform: 'scale(1.05)' }
                            }}>
                                <Avatar
                                    src={candidat.photo || '/default-avatar.png'}
                                    sx={{ width: 100, height: 100, margin: 'auto', border: '3px solid #1976d2' }}
                                />
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold">
                                        {candidat.nom} {candidat.prenom}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {candidat.parti || 'Indépendant'}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component={Link}
                                        to={`/candidat/${candidat.id}`}
                                        sx={{ marginTop: 2 }}
                                    >
                                        Voir détails
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography align="center" color="text.secondary">
                        Aucun candidat trouvé.
                    </Typography>
                )}
            </Grid>
        </Box>
    );
}

export default CandidateList;
