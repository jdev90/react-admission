import React, { useState, useEffect} from 'react';
import { Navigation, Pagination} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import {SERVER_URL} from 'context/config'; //

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/controller';
import 'swiper/css/effect-coverflow';


const MainImpsiComp = (props) => {  
    const [ipsiIndex, setIpsiIndex] = useState(""); //달별로 분리된 학사일정 리스트
    const ipsi1 = [ //수시
      {title: "원서접수",stdate: "2025.09.08",endate: "2025.09.12"},
      {title: "서류제출",stdate: "2025.09.08",endate: "2025.09.22"},
      {title: "면접고사",stdate: "2025.10.24 /창신인재면접",endate: ""},
      {title: "(최초)합격자발표",stdate: "2025.11.21(14:00)",endate: ""},
    ];
    const ipsi2 = [//정시
      {title: "원서접수",stdate: "2025.12.29",endate: "2025.12.31"},
      {title: "서류제출",stdate: "2025.12.29",endate: "2026.01.09"},
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
  },[ipsiList]);
  
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
            {/*__입시일정*/} 
            <div className='schedule'>
              <div className='title'>입시일정</div>
              <ul className='tab'>
                  <li><div className='tab_btn active' onClick={() => showTab(0)}>수시모집</div></li>
                  <li><div className='tab_btn' onClick={() => showTab(1)}>정시모집</div></li>
                  <li><div className='tab_btn' onClick={() => showTab(2)}>재외국민 외국인</div></li>
                  <li><div className='tab_btn' onClick={() => showTab(3)}>편입학</div></li>
              </ul>
              <div className={'bar bar'+ipsiList.length+ipsiIndex}></div>
              <ul className={'date'}>
                  {ipsiList?.map((data, index) => {
                    return(
                      <li className='date_item active' key={index}>
                        <p className='nm'>{data.title}</p>
                        <p>{data.stdate} {data.endate != '' ? `~${data.endate}` :''}</p>
                      </li>
                    )
                  })}
              </ul>
            </div>
        </>
        
    )
}

export default MainImpsiComp;