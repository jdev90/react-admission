import React, { useState, useEffect } from 'react';
import {  Link } from 'react-router-dom';
import MainBannerComp from './components/mainBannerComp';
import MainNoticeComp from './components/mainNoticeComp';
import MainGalleryComp from './components/mainGalleryComp';
import MainCalendarComp from './components/mainCalendarComp';
import MainIntroComp from './components/mainIntroComp';
import PopupComp from 'pages/main/components/PopupComp';

const Main = (props) => {    

    

    return(
        <>
            <PopupComp/>
            <MainBannerComp/>
            <div className='maincontain'>
                {/*1. 공지사항*/}
                <MainNoticeComp/>

                {/*2. 학사일정*/}
                <MainCalendarComp/>

                {/*3. 바로가기서비스*/}
                <div className='Main mainQuickServ'>
                    <ul>
                        <li><Link to={"https://tisc.cs.ac.kr/tisc/index.html"} target="_blank"><div className='btn'><img src="images/main/quick1.png"/><p>종합정보시스템</p> <div></div> </div></Link></li>
                        <li><Link to={"http://cs.certpia.com"} target="_blank"><div className='btn'><img src="images/main/quick2.png"/><p>인터넷증명서</p> <div></div> </div></Link></li>
                        <li><Link to={"http://lms.cs.ac.kr/"} target="_blank"><div className='btn'><img src="images/main/quick3.png"/><p>스마트LMS</p>< div></div> </div></Link></li>
                        <li><Link to={"https://rule.cs.ac.kr"} target="_blank"><div className='btn'><img src="images/main/quick4.png"/><p>규정류관리시스템</p> <div> </div></div></Link></li>
                        <li><Link to={"http://lib.cs.ac.kr/"} target="_blank"><div className='btn'><img src="images/main/quick5.png"/><p>도서관</p> <div></div> </div></Link></li>
                        <li><Link to={"/board/174/list"}><div className='btn'><img src="images/main/quick6.png"/><p>공지사항</p> <div></div> </div></Link></li>
                        <li><Link to={"/board/163/list"}><div className='btn'><img src="images/main/quick7.png"/><p>입학공지사항</p> <div></div> </div></Link></li>
                        <li><Link to={"/contents/66/view"}><div className='btn'><img src="images/main/quick8.png"/><p>오시는 길</p> <div></div> </div></Link></li>
                    </ul>
                </div> 
            </div> 


            {/*4. 학과소개*/}
            <MainIntroComp/>
            
            {/*5. 행사갤러리*/}
            <div className='maincontain'>
                <MainGalleryComp/>
            </div>
            

           
        </>
        
    )
}

export default Main;