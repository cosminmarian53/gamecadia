import "./Login.css"
import { Link } from "react-router-dom";
function Login()
{
    const revealPassword = () => 
    {
        let passWordField = document.getElementById("pass_input");
        if (passWordField.type === "password") 
        {
            passWordField.type = "text"; 
        } 
        else 
        {
            passWordField.type = "password";        
        }
    }

    return (
        <div id="loginContainer">
            <div id="loginBox">
                <h1>Log In</h1>
                <br></br>
                <form id="loginForm">
                    
                    <input type="text" placeholder="Username" id="user_input" required />
                    <div class="passDiv">
                    <input type="password" placeholder="Password" id="pass_input" required /><button onClick={revealPassword}>👁</button>
                    </div>
                    <br></br>
                    <input type="submit" value={"Log In"}></input>
                            

                </form>
                <br></br>
                <p><Link id="sign-up-link">No account? Sign Up!</Link></p>
            </div>
            
        </div>

    );
}
export default Login;