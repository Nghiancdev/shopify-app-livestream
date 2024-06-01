import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LiveStream from "./pages/LiveStream/LiveStream";
import PreRecorded from "./pages/PreRecorded/PreRecorded";

import Auth from "./pages/Auth";
import Analytic from "./pages/Analystic/Analytic";
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
