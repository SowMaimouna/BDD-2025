import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useEffect } from "react";

const ParrainageValide = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { success } = location.state || {};

    useEffect(() => {
        console.log("State reçu dans ParrainageValide :", location.state);
        if (location.state === null) {
            navigate("/"); //Redirige si la page est ouverte directement sans state
        }
    }, [location, navigate]);

    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md text-center">
            {success ? (
                <>
                    <h2 className="text-green-600 text-xl font-bold">✅ Parrainage validé avec succès !</h2>
                    <p>Merci d’avoir participé au parrainage.</p>
                </>
            ) : (
                <>
                    <h2 className="text-red-600 text-xl font-bold">❌ Échec du parrainage</h2>
                    <p>Vous avez peut-être déjà parrainé ou le code est incorrect.</p>
                </>
            )}
            <Button variant="contained" color="primary" onClick={() => navigate("/")}>
                Retour à l'accueil
            </Button>
        </div>
    );
};

export default ParrainageValide;
