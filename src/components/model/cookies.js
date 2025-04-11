
import "../styles/cookies.css";

function Cookies() {


    function handleAccept() 
    {    
        console.log("Cookies accepted");
        
        const dataExpirare = new Date();
        dataExpirare.setTime(dataExpirare.getTime() + (30*24*60*60*1000));//se seteaza data de expirare a cookie-ului la 30 de zile
        document.cookie = "acceptedCookies=true; expires=" + dataExpirare.toUTCString() + "; path=/; SameSite=Lax"; //se seteaza cookie-ul acceptat
        document.getElementById("cookies").style.display = "none"; //se ascunde pop-up-ul de cookies
    }

    function handleDecline() 
    {    
        console.log("Cookies declined");
        document.getElementById("cookies").style.display = "none"; //se ascunde pop-up-ul de cookies
    }

    //verificare cookie
    let acceptedCookies = document.cookie.split("; ").some(cookie => cookie.startsWith("acceptedCookies=true"));

    if(acceptedCookies==true)
    {
        return null;
        console.log("Cookie already accepted");
    }


    return (
        <div id='cookies'>
            <p>Vă rog acceptați cookie-urile pentru demonstrație</p>
            <div className="button-container">
                <button id='decline' onClick={handleDecline}>Decline</button>
                <button id='accept' onClick={handleAccept}>Accept</button>
            </div>
        </div>
    );
}

export default Cookies;
