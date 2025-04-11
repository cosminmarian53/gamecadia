import '../styles/navbar.css';

import { Link } from "react-router-dom";
import Login from '../../pages/Login.js';

function Navbar() {
  return (
    <nav>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=search" />
      <a  href='index.html'>

      <div id='home'>
        
      </div>
      </a>
    
      <form id='search_form'>
          <input type='text' id='search' placeholder='Cauta...' maxLength={100}/> 
          <input type='submit' value='🔍'></input>
      </form>
    

    <Link to ="/login">
        <div id='profile'></div>
    </Link>
    </nav>
  );
}

export default Navbar;
