
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage.jsx";
import StockPage from "./pages/StockPage.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/stock/:symbol" element={<StockPage />} />
      </Routes>
    </Router>
  );
};

export default App;
