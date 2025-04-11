import { BrowserRouter , Routes, Route } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

import Login from "./pages/Login"; 



import Navbar from './components/model/navbar';
import Body from './components/model/body';
import Footer from './components/model/footer';
import GameTab from './components/model/gametab';
import Cookies from './components/model/cookies';


function App() {
  return (
    <div>
    <BrowserRouter>
    
    <Navbar/>
    <Body>
    <Routes>
      <Route path="/login" element={<Login />}/>
      
    </Routes>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <GameTab game='Placeholder'/>
      <Cookies/>      
    </Body>
  </BrowserRouter>
    <Footer/>

    </div>
  );
}

export default App;
