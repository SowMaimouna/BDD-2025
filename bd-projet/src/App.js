import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import CandidateList from "./pages/CandidateList";
import VerifyParrainage from "./pages/VerifyParrainage"; 
import Parrainage from "./pages/Parrainage"; 
import ParrainageValide from "./pages/ParrainageValide";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/candidats" element={<CandidateList />} />
        <Route path="/verify-parrainage" element={<VerifyParrainage />} />
        <Route path="/parrainage" element={<Parrainage />} />
        <Route path="/parrainageValide" element={<ParrainageValide />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
