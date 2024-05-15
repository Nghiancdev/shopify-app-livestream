import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LiveStream from "./pages/LiveStream/LiveStream";
import PreRecorded from "./pages/PreRecorded";
import Analytic from "./pages/Analytic";
import Auth from "./pages/Auth";
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LiveStream />} />
        <Route exact path="/auth" element={<Auth />} />
        <Route exact path="/pre" element={<PreRecorded />} />
        <Route exact path="/analytic" element={<Analytic />} />
      </Routes>
    </Router>
  );
}

export default App;
