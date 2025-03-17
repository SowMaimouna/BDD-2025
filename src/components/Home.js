import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <>
            {/* ✅ Section principale avec image de fond */}
            <Box
                sx={{
                    position: 'relative',
                    height: '80vh',
                    backgroundImage: 'url(https://source.unsplash.com/random/?election)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {/* Overlay sombre pour améliorer la lisibilité */}
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}
                />
                <Container
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        textAlign: 'center',
                        color: 'white'
                    }}
                >
                    <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
                        Bienvenue dans le Système de Gestion des Parrainages
                    </Typography>
                    <Typography variant="h5" component="p" gutterBottom>
                        Simplifiez la gestion des candidatures et des parrainages pour les élections.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        component={Link}
                        to="/candidat"
                        sx={{ mt: 3 }}
                    >
                        Voir les Candidats
                    </Button>
                </Container>
            </Box>

            {/* ✅ Pied de page (Footer) */}
            <Box
                sx={{
                    textAlign: 'center',
                    padding: 3,
                    backgroundColor: '#1976d2',
                    color: 'white',
                    marginTop: 'auto'
                }}
            >
                <Typography variant="body1">
                    © {new Date().getFullYear()} Gestion des Parrainages - Tous droits réservés.
                </Typography>
                <Typography variant="body2">
                    Contactez-nous : <a href="mailto:support@parrainage.com" style={{ color: '#bbdefb' }}>support@parrainage.com</a>
                </Typography>
            </Box>
        </>
    );
}

export default Home;
