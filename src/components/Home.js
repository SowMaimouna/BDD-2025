import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <Box
            sx={{
                position: 'relative',
                height: '80vh',
                backgroundImage: 'url(https://source.unsplash.com/random/?election)', // ou une image locale /assets/home-bg.jpg
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
                <Typography variant="h2" component="h1" gutterBottom>
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
                    to="/candidats"
                    sx={{ mt: 3 }}
                >
                    Voir les Candidats
                </Button>
            </Container>
        </Box>
    );
}

export default Home;
