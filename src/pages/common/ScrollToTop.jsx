import React, { useState, useEffect } from 'react';



const ScrollToTop= (props) => {    
   
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleShowButton = () => {
            window.scrollY > 300 ? setShowButton(true) : setShowButton(false);
          };
      
          window.addEventListener('scroll', handleShowButton);
          return () => {
            window.removeEventListener('scroll', handleShowButton);
          };
    },[]);
    
    
    const Init = async () =>{
        try{
            
        }catch(e){
            console.log(e);
        }
    }   
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })  
    }

    return(
        showButton && (<div className="scroll__container">
            <button id="top" onClick={scrollToTop} type="button" > <span></span></button>
        </div>)
        
    )
}

export default ScrollToTop;