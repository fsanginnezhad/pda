// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Product from "./pages/Product";
import Login from "./pages/Logout";
import Logout from "./pages/Logout";
import InventoryReport from "./pages/InvertoryReport";
import CountPage from "./pages/CountPage";
import SerialMovementReport from "./pages/SerialMovementReport";
import SerialSummaryReport from "./pages/SerialSummaryReport";
import InventoryMenu from "./pages/InventoryMenu";
import Maintenance from "./pages/Maintenance";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index" element={<Index />} />
        <Route path="/product" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/report" element={<InventoryReport />} />
        <Route path="/count" element={<CountPage />} />
        <Route path="/report/serials" element={<SerialMovementReport />} />
        <Route path="/report/summary" element={<SerialSummaryReport />} />
        <Route path="/inventory" element={<InventoryMenu />} />
        <Route path="/maintenance" element={<Maintenance />} />
      </Routes>
    </Router>
  );
}


export default App;