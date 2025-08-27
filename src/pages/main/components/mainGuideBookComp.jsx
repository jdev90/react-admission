import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Navigation, Pagination, EffectCoverflow, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import {SERVER_URL} from 'context/config'; //
import {Link} from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/controller';

import 'swiper/css/effect-coverflow';
// import { Pagination, Navigation } from 'swiper/modules';

const MainGuideBookComp = (props) => {  
    const params = useParams();
    const menuCd = params.menuCd; 
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  // 자동 슬라이드
  useEffect(() => {
    const slider = sliderRef.current;
    const speed = 1;

    const autoScroll = () => {
      if (!slider) return;
      if (slider.scrollLeft >= slider.scrollWidth / 2) {
        slider.scrollLeft = 0;
      } else {
        slider.scrollLeft += speed;
      }
    };

    intervalRef.current = setInterval(autoScroll, 20);

    return () => clearInterval(intervalRef.current);
  }, []);

  // 수동 넘김
  const handleScroll = (direction) => {
    const slider = sliderRef.current;
    const slideWidth = 210; // 이미지 + margin-right (조정 필요)

    if (direction === 'next') {
      slider.scrollLeft += slideWidth;
    } else {
      slider.scrollLeft -= slideWidth;
    }
  };
  

    useEffect(() => {
       Init();
         
     },[]);
          
    const Init = async () =>{
        try{
           showBook(1)
        }catch(e){
            console.log(e);
        }
    }
    const bookList = [
        {title: "2025 CSU 신입생 정시모집요강",img:"/images/main/book_img1.png"},
        {title: "2025 CSU 신입생 수시모집요강",img:"/images/main/book_img2.png"},
        {title: "2025 창신대학교 후기 폅입학 모집요강",img:"/images/main/book_img3.png"},
    ];

    function showBook(index) {
        // 모든 탭 버튼과 콘텐츠를 숨기기
        var book = document.querySelectorAll('.slide-bk');
        console.log(book)
        for (var i = 0; i < book.length; i++) {
            book[i].classList.remove('active');
        }
        // 선택한 탭 버튼과 콘텐츠 활성화
        book[index].classList.add('active');
    }
    return(
        <>
            <div className='bkBgc'>
                <div className='Maincontain MainGuideBook'>                        
                    <div className='MainTitle'>
                        <p>창신대학교의 입시 관련 주요 서비스입니다.</p>
                        <h1>CSU<span>안내책자</span></h1>
                    </div>
                    <div className='guide_swiper'>
                        <Swiper
                            effect={'coverflow'}
                            centeredSlides={true}
                            slidesPerView={'auto'}
                            pagination={true}
                            modules={[ Pagination, Navigation]}
                            // slidesPerView={1}
                            // spaceBetween={30}
                            loop={true}
                            navigation={true}
                        >
                            {bookList?.map((data, index) =>(<>
                            <SwiperSlide><img className='slide-bk' src={data.img}/><div className='guide_title'>{data.title}</div></SwiperSlide>
                            </>
                            ))}
                        </Swiper>
                    </div>

                    {/* <div className='book_list'>
                        <div className='slider'>
                            <ul className='slider-container'>
                                {bookList?.map((data, index) =>(
                                <li className='slide-bk'><img src={data.img} /></li>
                                ))}
                            </ul> 
                            <ul className='slider-container bu'>
                                {bookList?.map((data, index) =>(
                                <li className='slide-bk'><img src={data.img} /></li>
                                ))}
                            </ul>  
                        </div>                               
                    </div>                                */}

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

export default MainGuideBookComp;