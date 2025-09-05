import React, { useState, useEffect } from 'react';
import {  Link,useLocation } from 'react-router-dom';
import MainBannerComp from './components/mainBannerComp';
import MainNoticeComp from './components/mainNoticeComp';
import MainGalleryComp from './components/mainGalleryComp';
import MainImpsiComp from './components/mainImpsiComp';
import MainGuideBookComp from './components/mainGuideBookComp';
import PopupComp from 'pages/main/components/PopupComp';
import {getMenuInfoMenuCd} from "assets/js/utils";

const Main = (props) => {  
  const [ipsiIndex, setIpsiIndex] = useState(""); //달별로 분리된 학사일정 리스트

  const location = useLocation();
  let early = getMenuInfoMenuCd(584)?.LINK;
  let regular = getMenuInfoMenuCd(585)?.LINK;
  let transfer = getMenuInfoMenuCd(586)?.LINK;
    // let international = getMenuInfoMenuCd(location.pathname + location.search);

  const quickmenulist = [
    {title: "수시모집",date: "2026",guideurl:"/early/guideline",rateurl:early,},
    {title: "정시모집",date: "2026",guideurl:"/regular/guideline",rateurl:regular,},
    {title: "편입학",date: "2026",guideurl:"/transfer/guideline",rateurl:transfer,},
    {title: "외국인",date: "2026",guideurl:"/international/guideline",rateurl:"",},
    
  ];

  const callList = [
    {title: "신입학",phone: "055) 250-1200",link: "/assistant/talk",},
    {title: "편입학", phone: "055) 250-1304, 6",link: "/transfer/talk",},
  ];

  const ipsi1 = [ //수시
    {title: "원서접수",stdate: "2025.09.08",endate: "2025.09.12"},
    {title: "서류제출",stdate: "2025.09.08",endate: "2025.09.22"},
    {title: "면접고사",stdate: "2025.10.24 /창신인재면접",endate: ""},
    {title: "(최초)합격자발표",stdate: "2025.11.21(14:00)",endate: ""},
  ];
  const ipsi2 = [
    {title: "원서접수",stdate: "2025.12.29",endate: "2025.12.31"},
    {title: "서류제출",stdate: "2025.08.29",endate: "2025.01.09"},
    {title: "합격자발표",stdate: "2026.01.22(10:00)",endate: ""},
    {title: "고지서출력",stdate: "2026.01.26",endate: "2026.02.05"},
    {title: "합격자등록",stdate: "2026.02.03",endate: "2026.02.05"},
  ];
  const ipsi3 = [
    {title: "원서접수",stdate: "2026.01.12",endate: "2026.01.16"},
    {title: "서류제출",stdate: "2026.01.12",endate: "2026.01.23"},
    {title: "합격자발표",stdate: "2026.02.04",endate: ""},
    {title: "등록금납부",stdate: "2026.02.09",endate: "2026.02.13"},
    {title: "추가모집",stdate: "2026.02.20",endate: "2026.02.27"},
  ];
  const ipsi4 = [
    {title: "원서접수/서류접수",stdate: "2025.07.15",endate: "2025.07.17"},
    {title: "면접/실기고사",stdate: "실시하지 않음",endate: ""},
    {title: "합격자발표",stdate: "2025.07.24 (14:00예정)",endate: ""},
    {title: "면접고사",stdate: "2025.07.28",endate: "2025.07.31"},
  ];
  const [ipsiList, setIpsiList] = useState(ipsi1); //달별로 분리된 학사일정 리스트

  useEffect(() => {
    Init();
  },[]);
  
  const Init = async () =>{
      try{
        setIpsiIndex(getCurrentSchedule())
      }catch(e){
        console.log(e);
      }
  }



  function showTab(index) {
    // 모든 탭 버튼과 콘텐츠를 숨기기
    var buttons = document.querySelectorAll('.tab_btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    // 선택한 탭 버튼과 콘텐츠 활성화
    buttons[index].classList.add('active');
    if(index === 0){
      setIpsiList(ipsi1);
    }else if(index === 1){
      setIpsiList(ipsi2);
    }else if(index === 2){
      setIpsiList(ipsi3);
    }else if(index === 3){
      setIpsiList(ipsi4);
    }
    setIpsiIndex(getCurrentSchedule())
  }
  

  // function getCurrentSchedule() {
  //   const today = new Date();

  //   const parseDate = (str) => {
  //     const [year, month, day] = str.split('.').map(Number);
  //     return new Date(year, month - 1, day); // JS는 month가 0부터 시작
  //   };

  //   const filtered = ipsi.filter(item => {
  //     const startDate = parseDate(item.stdate);
  //     return today >= startDate;
  //   });

  //   if (filtered.length === 0) return null;

  //   // 가장 최근 일정 (stdate가 가장 큰 것)
  //   const latest = filtered.reduce((latestItem, currentItem) => {
  //     return parseDate(currentItem.stdate) > parseDate(latestItem.stdate)? currentItem : latestItem;
  //   });

  //   console.log(latest)
  //   return latest;
  // }

  function getCurrentSchedule() {
    // 모든 탭 버튼과 콘텐츠를 숨기기
    var li = document.querySelectorAll('.date_item');
    
    const today = new Date();
    const parseDate = (str) => {
      const [year, month, day] = str.split('.').map(Number);
      return new Date(year, month - 1, day);
    };
    let latestIndex = 0;
    let latestDate = new Date(0); // 과거 날짜로 초기화
    for (let i = 0; i < ipsiList.length; i++) {
      const itemDate = parseDate(ipsiList[i].stdate);
      if (today >= itemDate && itemDate > latestDate) {
        latestDate = itemDate;
        latestIndex = i;
      }
    }

    for (var i = 0; i < li.length; i++) {
        li[i].classList.remove('active');
    }
    for (var i = 0; i <= latestIndex; i++) {
        li[i].classList.add('active');
    }
    
    // li[latestIndex].classList.add('active');
    return latestIndex+1 ; 
  }
    

    return(
        <>
            <PopupComp/>
            <MainBannerComp/>
            {/*1. 공지사항*/}
            <MainNoticeComp/>
            {/*4. 입학도우미*/}
            <div className='ipBgc'>
                <div className='Maincontain MainIphakService'>                        
                    <div className='MainTitle'>
                        <p>창신대학교의 입시 관련 주요 서비스입니다.</p>
                        <h1>CSU<span>입학도우미</span></h1>
                    </div> 
                    {/*__퀵메뉴*/} 
                    <ul className='quickbtn'>{quickmenulist.map((data, index) => (
                        <li>
                            <div className={'index index'+index}>
                                <p>{data.date}학년도</p>
                                <p className='title'>{data.title}</p>
                            </div>
                            <div className='btn'>
                                <Link to={data.guideurl}><div className='book'>모집요강</div></Link>
                                {data.rateurl != "" &&<Link to={data.rateurl} target='_blank'><div>경쟁률</div></Link>}
                            </div>
                        </li>
                    ))}</ul> 
                    {/*__연락처*/} 
                    <ul className='call'>{callList.map((data, index) => (
                        <li>
                            <div className="col col1">
                                {data.title}
                            </div>
                            <div className='col col2'>
                                <div className='num'>전화 상담<span>{data.phone}</span></div>
                                <div className={'link link'+index}>온라인 상담<span><Link to={data.link}>바로가기</Link></span></div>
                            </div>
                        </li>
                    ))}</ul>
                    <MainImpsiComp/>
                </div> 
            </div>
            
            {/*3. 홍보영상*/}
            <MainGalleryComp/>
            {/*2. 안내책자*/}
            <MainGuideBookComp/>
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
                    <p className='txt'>2025년 신입생(수시, 정시모집) 전원<br/> 등록금 전액(입학금 포함) 장학금 지급<br/> (간호학과 50% 지급)</p>
                  </li>
                </ul>

              </div>
            </div>
             {/*2. 학사일정
            <MainCalendarComp/>*/}

           
        </>
        
    )
}

export default Main;