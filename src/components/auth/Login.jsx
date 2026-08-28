import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, clearError } from "../../redux/slices/authSlice";
import { validateEmail } from "../../utils/validators";
import "../../styles/global.css";

export const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state) => state.auth);
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!validateEmail(email)) newErrors.email = "Valid email required";
        if (!password || password.length < 8) newErrors.password = "Password must be at least 8 characters";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        dispatch(clearError());
        const result = await dispatch(loginUser({ email, password }));
        if (result.payload?.user) navigate("/dashboard");
    };

    const errorMessage = typeof error === 'string' ? error : error?.message || error?.error || 'Login failed';

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-card-header">
                    <h1>Welcome Back</h1>
                    <p>Login to your Ajali! account</p>
                </div>
                
                {error && <div className="alert alert-error">{errorMessage}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">Email</label>
                        <input
                            type="email"
                            className={`input ${errors.email ? "input-error" : ""}`}
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label className="label">Password</label>
                        <input
                            type="password"
                            className={`input ${errors.password ? "input-error" : ""}`}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <span className="form-error">{errors.password}</span>}
                    </div>
                    
                    <div className="forgot-link">
                        <Link to="/forgot-password">Forgot password?</Link>
                    </div>
                    
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
                
                <div className="auth-divider">
                    <span>Don't have an account?</span>
                </div>
                
                <Link to="/register" className="btn btn-secondary">
                    Create Account
                </Link>
            </div>
        </div>
    );
};