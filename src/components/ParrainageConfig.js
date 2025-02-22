import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

function ParrainageConfig() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/parrainage', { date_debut: startDate, date_fin: endDate })
            .then(response => {
                setMessage(response.data.message);
            })
            .catch(err => {
                console.error(err);
                setMessage("Erreur lors de la configuration du parrainage.");
            });
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
                <Typography variant="h5" textAlign="center" gutterBottom>
                    Configuration du Parrainage
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Date de début"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        fullWidth
                        type="date"
                        label="Date de fin"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Enregistrer la Période
                    </Button>
                    {message && <Typography textAlign="center" sx={{ marginTop: 2 }}>{message}</Typography>}
                </form>
            </Paper>
        </Container>
    );
}

export default ParrainageConfig;
