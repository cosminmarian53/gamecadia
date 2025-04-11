import '../styles/gametab.css';



function GameTab({game}) 
{
  let screenWidth = window.innerWidth;
  let screenHeight = window.innerHeight;
  let divWidth = 25;
  
  if(screenHeight > screenWidth)
  {
    divWidth = 100;
  }
    return(
        <div className='gametab' style={{width: `${divWidth}%`}}>
          text
        </div>
    )


}

export default GameTab;