import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useLocation } from 'react-router-dom';
import { setCookie, getCookie } from 'context/cookieUtils';  // 쿠키 관련 함수는 별도로 분리해서 처리할 수 있습니다.
import { SERVER_URL } from 'context/config';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/controller';

const PopupComp = () => {
    const [popupVisible, setPopupVisible] = useState(false);
    const [swiperInstance, setSwiperInstance] = useState(null);
    const location = useLocation();
    const [swiper, setSwiper] = useState(null);
    const [popupList, setPopupList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mainBannerCount, setMainBannerCount] = useState(1);

    useEffect(() => {
        Init();
        const swiperInstance = document.querySelector('.swiper-container').swiper;
        setSwiper(swiperInstance);
    }, []);

    const Init = async () => {
        try{
            setLoading(false);
            let JsonArray = new Array();
            let JsonObject = new Object;
            JsonObject.HP_CD = 'ADMISSION';
            JsonArray.push(JsonObject);
            const res = await fetch(SERVER_URL+'/api/popup/list',{method:"POST", headers:{'content-type':'application/json'}, body : JSON.stringify(JsonArray)});     
            const data = await res.json(); 
            setPopupList(data.getPopupList);
            setLoading(true);
            console.log(data.getPopupList);
        }catch(e){
            console.log(e);
        }
    }

    useEffect(() => {

        if(loading){
            // 페이지 로드 시, 팝업 슬라이드 수 업데이트
            //const slideCount = document.querySelectorAll('#popup-slide-box .swiper-slide').length;
            // document.querySelector(".btn_popup .cnt").innerHTML = slideCount || "0";
            // 페이지 로드 후 팝업 표시 여부 결정
            
            if (getCookie("popupShown") !== "true") {
                const resultCount = Array.isArray(popupList) ? popupList.length : 0;
                if (resultCount > 0) {
                    setPopupVisible(true);
                }
            }
        }
            
    }, [loading]);

    // 팝업 열기
    const handlePopupOpen = () => {
        const resultCount = document.querySelectorAll('#popup-slide-box .swiper-slide').length;
        if (resultCount > 0) {
            setPopupVisible(true);
            if (swiperInstance) {
                swiperInstance.update();
            }
        } else {
            alert("현재 게시된 팝업이 없습니다.");
        }
    };

    // 팝업 닫기
    const handlePopupClose = () => {
        setPopupVisible(false);
    };

    // 오늘 하루 그만 보기
    const handleOneDayClose = () => {
        setCookie("popupShown", "true", 1);
        setPopupVisible(false);
    };

    // 7일 동안 그만 보기
    const handleWeekClose = () => {
        setCookie("popupShown", "true", 7);
        setPopupVisible(false);
    };

    // swiper 슬라이더 설정
    const swiperSettings = {
        //loop: true,
        slidesPerView: 3,
        spaceBetween: 25,
        pagination: {
            type: 'fraction',
            renderFraction: (currentClass, totalClass) => (
                <span className={currentClass}>0</span> + 
                <div className="line"></div> + 
                <span className={totalClass}>0</span>
            ),
        },
        navigation: {
            nextEl: '#popup-slide-box .swiper-button-next',
            prevEl: '#popup-slide-box .swiper-button-prev',
        },
        speed: 800,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        //breakpoints: {
        //    480: {
        //        slidesPerView: 1,
        //        spaceBetween: 15,
        //    },
        //    768: {
        //        slidesPerView: 2,
        //        spaceBetween: 15,
        //    },
        //    1280: {
        //        slidesPerView: 3,
        //        spaceBetween: 15,
        //    },
        //}
        
    };

    return (
        <div id="popup-slide-box" style={{ display: popupVisible ? 'block' : 'none' }}>
            <div className="inner">
                <div className="slide-wrap">
                    <div className="ctrl-box">
                        <div className="swiper-pagination"></div>
                        <button type="button" className="swiper-button-prev" title="이전 팝업 보기">
                            <i className="xi-angle-left"></i>
                        </button>
                        <button type="button" className="btn-play" title="팝업 재생">
                            <i className="xi-play"></i>
                        </button>
                        <button type="button" className="btn-pause active" title="팝업 재생 중지">
                            <i className="xi-pause"></i>
                        </button>
                        <button type="button" className="swiper-button-next" title="다음 팝업 보기">
                            <i className="xi-angle-right"></i>
                        </button>
                    </div>
                    <Swiper {...swiperSettings} onSwiper={(swiper)=>{setMainBannerCount(swiper.slides.length);}} 
                    >
                    
                    {loading && popupList && Array.isArray(popupList) && popupList.map((data, index)=> { 
                        let imgContents = data.CONTENT;  
                        return(
                            <SwiperSlide key={index}>                                                                
                                <div className="img"  dangerouslySetInnerHTML={{ __html:  imgContents }}/>
                            </SwiperSlide>  
                        )})
                    }
                            
                    </Swiper>
                    <div className="btn-box">
                        <button type="button" className="btn-week" onClick={handleWeekClose}>7일간 그만 보기</button>
                        <button type="button" className="btn-oneday" onClick={handleOneDayClose}>오늘 하루 그만 보기</button>
                        <button type="button" className="btn-cls" onClick={handlePopupClose}>닫기</button>
                    </div>
                </div>
                <div className="popup-slide-bg" onClick={handlePopupClose}></div>
            </div>
        </div>
    );
};

export default PopupComp;
