import React, { useState, useEffect } from 'react';
import {  Link } from 'react-router-dom';
import MainBannerComp from './components/mainBannerComp';
import MainNoticeComp from './components/mainNoticeComp';
import MainGalleryComp from './components/mainGalleryComp';
import MainCalendarComp from './components/mainCalendarComp';
import MainIntroComp from './components/mainIntroComp';
import PopupComp from 'pages/main/components/PopupComp';

const Main = (props) => {    
    const quickmenulist = [
    {
      title: "수시모집",
      date: "2026",
    },
    {
      title: "정시모집",
      date: "2026",
    },
    {
      title: "외국인",
      date: "2026",
    },
    {
      title: "편입학",
      date: "2026",
    }
  ];

  const callList = [
    {
      title: "신입학",
      phone: "055) 250-1200",
      link: "",
    },
    {
      title: "편입학",
      phone: "055) 250-1304, 6",
      link: "",
    },
    
  ];

  const imsi = [
    {title: "원서접수"},
    {title: "서류제출"},
    {title: "면접고사"},
    {title: "(최초)합격자발표"},
  ];
    

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
            
            {/*4. 입학도우미*/}
            <div className='qsBgc'>
                <div className='Maincontain MainQuickService'>                        
                    <div className='MainTitle'>
                        <p>창신대학교의 입시 관련 주요 서비스입니다.</p>
                        <h1>CSU<span>입학도우미</span></h1>
                    </div> 
                    {/*퀵메뉴*/} 
                    <ul className='quickbtn'>{quickmenulist.map((data, index) => (
                        <li><Link>
                            <div className={'index index'+index}>
                                <p>{data.date}학년도</p>
                                <p className='title'>{data.title}</p>
                            </div>
                            <div className='btn'>
                                <div className='book'>모집요강</div>
                                <div>경쟁률</div>
                            </div>
                        </Link></li>
                    ))}</ul> 
                    {/*전화*/} 
                    <ul className='call'>{callList.map((data, index) => (
                        <li><Link>
                            <div className="col col1">
                                {data.title}
                            </div>
                            <div className='col col2'>
                                <div className='num'>전화 상담<span>{data.phone}</span></div>
                                <div className='link'>온라인 상담<span>바로가기</span></div>
                            </div>
                        </Link></li>
                    ))}</ul>
                    {/*입시일정*/} 
                    <div className='schedule'>
                        <ul className='tab'>
                            <li><div>수시모집</div></li>
                            <li><div>정시모집</div></li>
                            <li><div>재외국민 외국인</div></li>
                            <li><div>평입학</div></li>
                        </ul>
                        <ul className='date'>
                            {imsi.map((data, index) => (
                            <li>
                                {data.title}
                            </li>
                            ))}
                        </ul>
                    </div>

                </div> 
                
                                
            </div>
            

           
        </>
        
    )
}

export default Main;