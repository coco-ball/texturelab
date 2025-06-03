import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/Home";
import TexturePage from "./pages/Texture";
// import TextureViewer from "./components/TextureViewer";
import { TextureProvider } from "./context/TextureContext";

function App() {
  return (
    <TextureProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/texture/:id" element={<TexturePage />} />
        </Routes>
      </Router>
    </TextureProvider>
  );
}

export default App;
