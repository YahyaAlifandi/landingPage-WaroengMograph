import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Index from "./pages";
import FreePreset from "./pages/Event/FreePreset";
import DevModeScreen from "./pages/DevModeScreen";
import TambahPreset from "./pages/Event/addPreset";

export default function APp() {
  const devMode = import.meta.env.VITE_DEVELOPMENT === "true";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/event/free-preset" element={<FreePreset />} />

        {/* Jika devMode = true → boleh masuk AddPreset */}
        {devMode ? (
          <Route
            path="/event/free-preset/add-preset"
            element={<TambahPreset />}
          />
        ) : (
          // Jika devMode = false → redirect otomatis
          <Route
            path="/event/free-preset/add-preset"
            element={<Navigate to="/development-mode" />}
          />
        )}

        {/* Halaman Development Mode */}
        <Route path="/development-mode" element={<DevModeScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
