import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoMusicalNotes, IoHome, IoSearch } from "react-icons/io5";
import { MdPlaylistPlay, MdLogout } from "react-icons/md";
import { FaUser } from "react-icons/fa";
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
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <IoMusicalNotes className="logo-icon" />
                    </div>
                    <h2 className="sidebar-title">Music Manager</h2>
                </div>

                <nav className="sidebar-nav">
                    <Link 
                        to="/home" 
                        className={isActive("/home") ? "sidebar-link active" : "sidebar-link"}
                    >
                        <IoHome className="link-icon" />
                        <span>Início</span>
                    </Link>
                    <Link 
                        to="/playlists" 
                        className={isActive("/playlists") ? "sidebar-link active" : "sidebar-link"}
                    >
                        <MdPlaylistPlay className="link-icon" />
                        <span>Playlists</span>
                    </Link>
                    <Link 
                        to="/musicas" 
                        className={isActive("/musicas") ? "sidebar-link active" : "sidebar-link"}
                    >
                        <IoSearch className="link-icon" />
                        <span>Buscar Músicas</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">
                            <FaUser />
                        </div>
                        <div className="user-details">
                            <span className="user-email">{user}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-button">
                        <MdLogout className="logout-icon" />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>
            <main className="main-content">{children}</main>
        </div>
    );
};

export default Layout;

