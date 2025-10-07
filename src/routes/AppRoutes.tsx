import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Playlists from "../pages/Playlists";
import Musicas from "../pages/Musicas";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/playlists"
                    element={
                        <PrivateRoute>
                            <Playlists />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/musicas"
                    element={
                        <PrivateRoute>
                            <Musicas />
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
