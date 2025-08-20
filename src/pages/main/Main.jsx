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
            {/*1. 공지사항*/}
            <MainNoticeComp/>

            {/*2. 학사일정
            <MainCalendarComp/>*/}

                


            {/*4. 학과소개*/}
            <MainIntroComp/>
            
            {/*5. 행사갤러리*/}
            <MainGalleryComp/>
            

           
        </>
        
    )
}

export default Main;