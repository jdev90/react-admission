import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {SERVER_URL} from 'context/config'; //
import {Link} from 'react-router-dom';

const MainIntroComp = (props) => {  
    const params = useParams();
    const menuCd = params.menuCd; 
  

   
          
    const Init = async () =>{
        try{
           
        }catch(e){
            console.log(e);
        }
    }

   
    return(
        <>
            <div className='bkBgc'>
                <div className='Maincontain MainBook'>                        
                    <div className='MainTitle'>
                        <p>창신대학교의 입시 관련 주요 서비스입니다.</p>
                        <h1>CSU<span>안내책자</span></h1>
                    </div>
                    <div className='book_list'>
                        <ul>
                            <li className='bk bk0'><img src='/images/main/book_img1.png' /></li>
                            <li className='bk bk1'><img src='/images/main/book_img2.png' /></li>
                            <li className='bk bk2'><img src='/images/main/book_img3.png' /></li>
                            <li className='bk'><img src='/images/main/book_img1.png' /></li>
                            <li className='bk'><img src='/images/main/book_img1.png' /></li>
                            <li className='bk'><img src='/images/main/book_img1.png' /></li>
                        </ul> 
                    </div>                               

                <div id="popup-slide-box" >
                    <div className="inner">
                        <div className="slide-wrap">
                            <div className="img"/>
                        </div>
                    </div>
                </div>


                </div>    

            </div>        

           
        </>
        
    )
}

export default MainIntroComp;