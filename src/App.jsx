import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import WsPage from "./pages/WsPage";
import LocationPage from "./pages/LocationPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/ws" element={<WsPage />} />
          <Route path="/location" element={<LocationPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
