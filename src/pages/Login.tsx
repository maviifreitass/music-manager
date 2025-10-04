import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/authSlice";
import "./Login.css";

const VALID_EMAIL = "usuario@teste.com";
const VALID_PASSWORD = "123456";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { email?: string; password?: string } = {};

        if (!validateEmail(email)) {
            newErrors.email = "Formato de e-mail inválido";
        } else if (email !== VALID_EMAIL) {
            newErrors.email = "E-mail incorreto";
        }

        if (password.length < 6) {
            newErrors.password = "A senha deve ter no mínimo 6 caracteres";
        } else if (password !== VALID_PASSWORD) {
            newErrors.password = "Senha incorreta";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        dispatch(login(email));
        sessionStorage.setItem("lastLogin", new Date().toISOString());
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
                
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">E-mail</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={errors.email ? "input-error" : ""}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="password">Senha</label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={errors.password ? "input-error" : ""}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>
                    
                    <button type="submit" className="login-button">
                        Entrar
                    </button>
                    
                    <div className="login-hint">
                        <small>Dica: usuario@teste.com / 123456</small>
                    </div>
                </form>

                <div className="login-footer">
                </div>
            </div>
        </div>
    );
}

export default Login;
