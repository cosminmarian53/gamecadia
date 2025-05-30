import { BrowserRouter , Routes, Route } from "react-router-dom";

import "./App.css";

import Login from "./pages/Login"; 
import Signup from "./pages/Signup";


import Navbar from './components/model/navbar';
import Body from './components/model/body';
import Footer from './components/model/footer';
import GameTab from './components/model/gametab';
import Cookies from './components/model/cookies';
import Spacer from './components/model/spacer';
import PlayPort from "./pages/PlayPort";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <div>
    <BrowserRouter>
   
    <Navbar/> 
    <Body>
       <UserProfile 
            PlayerName="User1" 
            PublishedGames={[
              "https://example.com/game1",
              "https://example.com/game2"
            ]}
          />
    <Routes>
    <Route path="/login" element={<Login />}/>
    <Route path="/signup" element={<Signup />}/>
    </Routes>
      <Spacer/>
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
