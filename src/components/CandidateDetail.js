import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Typography, Avatar, Button, Snackbar, Box, CircularProgress } from '@mui/material';

function CandidateDetail() {
    const { id } = useParams();
    const [candidat, setCandidat] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/candidat/${id}`)
            .then(response => {
                if (!response.data) {
                    setError("Candidat introuvable.");
                } else {
                    setCandidat(response.data);
                }
                setLoading(false);
            })
            .catch(err => {
                setError("Erreur lors de la récupération du candidat.");
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        console.log("ID récupéré:", id);
        axios.get(`http://localhost:5000/api/candidat/${id}`)
            .then(response => {
                setCandidat(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError("Erreur lors de la récupération du candidat.");
                setLoading(false);
            });
    }, [id]);


    const handleGenerateCode = async () => {
        if (!candidat?.email) {
            setMessage("Email du candidat introuvable.");
            setOpenSnackbar(true);
            return;
        }

            setSending(true);
        try {
            const response = await axios.post("http://localhost:5000/api/auth/send-otp", { email: candidat.email });
            setMessage(response.data.message || "Code envoyé avec succès !");
        } catch (error) {
            console.error(error);
            setMessage("Erreur lors de l'envoi du code.");
        }
        setOpenSnackbar(true);
        setSending(false);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f3f4f6 30%, #e0e7ff 100%)',
            padding: 2
        }}>
            <Card sx={{
                maxWidth: 500,
                width: '100%',
                padding: 3,
                boxShadow: 5,
                borderRadius: 3,
                backgroundColor: '#ffffff',
            }}>
                <Box textAlign="center" mb={2}>
                    <Avatar
                        src={candidat.photo || '/default-avatar.png'}
                        sx={{ width: 120, height: 120, margin: 'auto', border: '4px solid #1976d2' }}
                    />
                    <Typography variant="h5" fontWeight="bold" mt={2}>
                        {candidat.nom} {candidat.prenom}
                    </Typography>
                </Box>

                <CardContent sx={{ textAlign: 'center' }}>
                    <img
                        src={`http://localhost:5000/${candidat.photo}`}
                        alt={candidat.nom}
                        style={{ width: 100, height: 100, borderRadius: '50%' }}
                    />
                    <Typography variant="body1"><strong>Email :</strong> {candidat.email}</Typography>
                    <Typography variant="body1"><strong>Téléphone :</strong> {candidat.telephone}</Typography>
                    <Typography variant="body1"><strong>Parti :</strong> {candidat.parti}</Typography>
                    <Typography variant="body1"><strong>Slogan :</strong> {candidat.slogan}</Typography>
                    <Box mt={3} display="flex" justifyContent="center" gap={2}>
                        <Button
                            onClick={handleGenerateCode}
                            variant="contained"
                            color="secondary"
                            disabled={sending}

                        >
                            {sending ? "Envoi..." : "Générer un code"}
                        </Button>

                        <Button
                            component={Link}
                            to={`/candidat/${id}/parrainages`}
                            variant="contained"
                            color="primary"
                        >
                            Voir parrainages
                        </Button>
                    </Box>
                </CardContent>

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={4000}
                    onClose={() => setOpenSnackbar(false)}
                    message={message}
                />
            </Card>
        </Box>
    );
}

export default CandidateDetail;
