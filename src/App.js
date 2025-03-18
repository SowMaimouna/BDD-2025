import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Typography } from '@mui/material';
import Home from './components/Home';
import CandidateList from './components/CandidateList';
import CandidateRegistration from './components/CandidateRegistration';
import CandidateDetail from './components/CandidateDetail';
import CandidateParrainages from "./components/CandidateParrainages";
import ParrainageConfig from "./components/ParrainageConfig";


function App() {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Gestion des Parrainages
                    </Typography>
                    <Button color="inherit" component={Link} to="/">Accueil</Button>
                    <Button color="inherit" component={Link} to="/candidat">Candidats</Button>
                    <Button color="inherit" component={Link} to="/candidat/new">Ajouter Candidat</Button>
                    <Button color="inherit" component={Link} to="/parrainage">Parrainage</Button>


                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 4 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/candidat" element={<CandidateList />} />
                    <Route path="/candidat/new" element={<CandidateRegistration />} />
                    <Route path="/candidat/:id" element={<CandidateDetail />} />
                    <Route path="/candidat/:id/parrainages" element={<CandidateParrainages />} />
                    <Route path="/parrainage" element={<ParrainageConfig />} />


                </Routes>
            </Container>
        </Router>
    );
}

export default App;