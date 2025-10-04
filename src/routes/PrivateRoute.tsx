import React, {type JSX} from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
    // TODO
    children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const isAuthenticated = true; // TODO implement verification

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
