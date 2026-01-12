import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieList from "./pages/MovieList";
import MoviePlayer from "./pages/MoviePlayer";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* default route */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/movies" element={<MovieList />} />
        <Route path="/movies/:movieId" element={<MoviePlayer />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
