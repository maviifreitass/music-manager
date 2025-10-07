import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMusicalNotes } from "react-icons/io5";
import { login } from "../redux/authSlice";
import "./Login.css";

const VALID_USERS = [
    { email: "usuario@teste.com", password: "123456", name: "João Silva" },
    { email: "maria@teste.com", password: "123456", name: "Maria Santos" },
];

type ValidationErrors = { email?: string; password?: string };

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<ValidationErrors>({});

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const getEmailError = (email: string): string | undefined => {
        if (!validateEmail(email)) return "Formato de e-mail inválido";
        
        const userExists = VALID_USERS.some(user => user.email === email);
        if (!userExists) return "E-mail não cadastrado";
        
        return undefined;
    };

    const getPasswordError = (email: string, password: string): string | undefined => {
        if (password.length < 6) return "A senha deve ter no mínimo 6 caracteres";
        
        const user = VALID_USERS.find(user => user.email === email);
        if (user && user.password !== password) return "Senha incorreta";
        
        return undefined;
    };

    const validateForm = (): ValidationErrors => {
        const emailError = getEmailError(email);
        const passwordError = getPasswordError(email, password);

        return {
            ...(emailError && { email: emailError }),
            ...(passwordError && { password: passwordError }),
        };
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
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
                    <div className="logo-icon"><IoMusicalNotes /></div>
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
                </form>

            </div>
        </div>
    );
}

export default Login;
