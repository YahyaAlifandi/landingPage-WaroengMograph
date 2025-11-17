import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages";
import FreePreset from "./pages/Event/FreePreset";
import DevModeScreen from "./pages/DevModeScreen";
import TambahPreset from "./pages/Event/addPreset";

export default function APp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/event/free-preset" element={<FreePreset />} />
        {import.meta.env.VITE_DEVELOPMENT == "true" ? (
          <Route path="/event/free-preset/add-preset" element={<TambahPreset />} />
        ) : <Route path="/development-mode" element={<DevModeScreen />} />}
      </Routes>
    </BrowserRouter>
  );
}
