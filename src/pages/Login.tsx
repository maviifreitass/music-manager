import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/authSlice";
import "./Login.css";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = () => {
        dispatch(login("usuario@teste.com"));
        navigate("/home");
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-icon">♪</div>
                    <h1 className="login-title">Music Manager</h1>
                    <p className="login-subtitle">SUA INTERFACE MUSICAL</p>
                </div>
                
                <div className="login-form">
                    <div className="input-group">
                        <label htmlFor="email">E-mail</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="seu@email.com"
                            defaultValue="usuario@teste.com"
                        />
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="password">Senha</label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <button className="login-button" onClick={handleLogin}>
                        Entrar
                    </button>
                </div>
                
                <div className="login-footer">
                    <a href="#" className="forgot-password">Esqueceu sua senha?</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
