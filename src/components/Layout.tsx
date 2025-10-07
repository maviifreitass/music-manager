import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoMusicalNotes } from "react-icons/io5";
import { logout } from "../redux/authSlice";
import type { RootState } from "../redux/store";
import "./Layout.css";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="layout">
            <nav className="navbar">
                <div className="navbar-brand">
                    <span className="navbar-icon"><IoMusicalNotes /></span>
                    <span className="navbar-title">Music Manager</span>
                </div>
                <div className="navbar-menu">
                    <Link to="/home" className={isActive("/home") ? "navbar-link active" : "navbar-link"}>
                        Início
                    </Link>
                    <Link to="/playlists" className={isActive("/playlists") ? "navbar-link active" : "navbar-link"}>
                        Playlists
                    </Link>
                    <Link to="/musicas" className={isActive("/musicas") ? "navbar-link active" : "navbar-link"}>
                        Buscar Músicas
                    </Link>
                </div>
                <div className="navbar-user">
                    <span className="navbar-email">{user}</span>
                    <button onClick={handleLogout} className="logout-button">
                        Sair
                    </button>
                </div>
            </nav>
            <main className="main-content">{children}</main>
        </div>
    );
};

export default Layout;

