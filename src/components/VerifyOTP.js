import { useState } from "react";
import axios from "axios";

const VerifyOTP = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");

    const handleVerifyOTP = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/candidat/verify-otp", { email, otp });
            setMessage(res.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || "Erreur de validation.");
        }
    };

    return (
        <div className="verify-otp-container">
            <h2>Vérifier votre code</h2>
            <input
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Entrez le code OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
            />
            <button onClick={handleVerifyOTP}>Valider</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default VerifyOTP;
