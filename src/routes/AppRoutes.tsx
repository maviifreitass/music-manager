import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "../pages/Login.tsx";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>}/>

                // TODO
                {/*<Route path="/home" element={ <PrivateRoute> <HomePage/> </PrivateRoute>  } />*/}
                {/*<Route path="/playlists" element={ <PrivateRoute> <PlaylistsPage/> </PrivateRoute> } />*/}
                {/*<Route path="/musicas"  element={ <PrivateRoute> <MusicasPage/>  </PrivateRoute> } />*/}

                <Route path="*" element={<Login/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
