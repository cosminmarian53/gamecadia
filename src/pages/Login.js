import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login_Signup.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
    };

    return (
        <div id="loginContainer" >
            <div id="loginBox">
                <h1>Log In</h1>
                <form id="loginForm" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="button"
                        id="reveal_button"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? "Hide Password" : "Reveal Password"}
                    </button>

                    <br />
                    <input type="submit" value="Log In" />
                </form>

                <br />
                <p><Link id="sign-up-link" to="/signup">No account? Sign Up!</Link></p>
            </div>
            {/*<div id="spacer" style={{backgroundColor:"green"}}></div>*/}
        </div>
    );
}

export default Login;
