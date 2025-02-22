import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Typography, Avatar, Button } from '@mui/material';

function CandidateDetail() {
    const { id } = useParams();
    const [candidat, setCandidat] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:5000/api/candidats/${id}`)
            .then(response => setCandidat(response.data))
            .catch(err => {
                console.error(err);
                setError("Erreur lors de la récupération du candidat.");
            });
    }, [id]);

    if (error) return <Typography color="error">{error}</Typography>;
    if (!candidat) return <Typography>Chargement...</Typography>;

    return (
        <Card sx={{ maxWidth: 500, margin: 'auto', marginTop: 4 }}>
            <Avatar src={candidat.photo || '/default-avatar.png'} sx={{ width: 100, height: 100, margin: 'auto', marginTop: 2 }} />
            <CardContent>
                <Typography variant="h5">{candidat.nom} {candidat.prenom}</Typography>
                <Typography>Email: {candidat.email}</Typography>
                <Typography>Téléphone: {candidat.telephone}</Typography>
                <Typography>Parti: {candidat.parti || 'Indépendant'}</Typography>
                <Typography>Slogan: {candidat.slogan}</Typography>
                <Button variant="contained" color="secondary" sx={{ marginTop: 2 }}>
                    Générer nouveau code
                </Button>
            </CardContent>
        </Card>
    );
}

export default CandidateDetail;
