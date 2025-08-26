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
    {title: "면접고사"},
    {title: "(최초)합격자발표"},
  ];
  function showTab(index) {
    // 모든 탭 버튼과 콘텐츠를 숨기기
    var buttons = document.querySelectorAll('.tab_btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    // 선택한 탭 버튼과 콘텐츠 활성화
    buttons[index].classList.add('active');
  }
    

    return(
        <>
            <PopupComp/>
            <MainBannerComp/>
            {/*1. 공지사항*/}
            <MainNoticeComp/>

            {/*2. 학사일정
            <MainCalendarComp/>*/}

                


            {/*4. 학과소개
            <MainIntroComp/>*/}
            
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
                        <li>
                            <div className={'index index'+index}>
                                <p>{data.date}학년도</p>
                                <p className='title'>{data.title}</p>
                            </div>
                            <div className='btn'>
                                <Link><div className='book'>모집요강</div></Link>
                                <Link><div>경쟁률</div></Link>
                            </div>
                        </li>
                    ))}</ul> 
                    {/*전화*/} 
                    <ul className='call'>{callList.map((data, index) => (
                        <li>
                            <div className="col col1">
                                {data.title}
                            </div>
                            <div className='col col2'>
                                <div className='num'>전화 상담<span>{data.phone}</span></div>
                                <div className={'link link'+index}>온라인 상담<span><Link>바로가기</Link></span></div>
                            </div>
                        </li>
                    ))}</ul>
                    {/*입시일정*/} 
                    <div className='schedule'>
                      <div className='title'>입시일정</div>
                      <ul className='tab'>
                          <li><div className='tab_btn active' onClick={() => showTab(0)}>수시모집</div></li>
                          <li><div className='tab_btn' onClick={() => showTab(1)}>정시모집</div></li>
                          <li><div className='tab_btn' onClick={() => showTab(2)}>재외국민 외국인</div></li>
                          <li><div className='tab_btn' onClick={() => showTab(3)}>평입학</div></li>
                      </ul>
                      <div className='bar'></div>
                      <ul className='date'>
                          {imsi.map((data, index) => (
                          <li className='date_item active'>
                              <p className='nm'>{data.title}</p>
                              <p>2025.09.08(월) ~09.12(금)</p>
                          </li>
                          ))}
                      </ul>
                    </div>

                </div> 
            </div>
            {/*5. WhyCSU*/}
            <div className='wcBgc'>
              <div className='Maincontain MainWhycsu'>  
                <div className='wcTitle'>
                    <p><span>NO.1 </span>CSU</p>
                    <h1>왜! 창신대학교인가?</h1>
                </div>
                <ul>
                  <li className='wc1'>
                    <p className='pcent'>82.1%</p>
                    <p className='titl'>유지 취업률</p>
                    <p className='txt'>부울경 사립대학 중 1위<br/>(2021.12.31.기준, 2022 대학정보공시)</p>
                  </li>
                  <li className='wc2'>
                    <p className='pcent'>71.8%</p>
                    <p className='titl'>졸업생 취업률</p>
                    <p className='txt'>경남 62.3%, 전국 66.3%<br/>(2022.12.31.기준, 2023 대학정보공시)</p>
                  </li>
                  <li className='wc3'>
                    <p className='pcent'>100%</p>
                    <p className='titl'>부영그룹 우정장학생 특별장학금</p>
                    <p className='txt'>2024년 신입생(수시, 정시모집) 전원<br/> 등록금 전액(입학금 포함) 장학금 지급<br/> (간호학과 50% 지급)</p>
                  </li>
                </ul>

              </div>
            </div>
            

           
        </>
        
    )
}

export default Main;