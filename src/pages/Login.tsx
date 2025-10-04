import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/authSlice";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = () => {
        dispatch(login("usuario@teste.com"));
        navigate("/home");
    };

    return (
        <div>
            <h2>Login</h2>
            <button onClick={handleLogin}>Entrar</button>
        </div>
    );
}

export default Login;
