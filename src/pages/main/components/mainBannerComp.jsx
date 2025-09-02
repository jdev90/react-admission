import React, { useState, useEffect } from 'react';
import { Navigation, Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Link} from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/controller';

const MainBannerComp = (props) => {
    const navigationPrevRef = React.useRef(null);
    const navigationNextRef = React.useRef(null);
    const [mainBannerCurrentIndex, setMainBannerCurrentIndex] = useState(1);
    const [swiper, setSwiper] = useState(null);
    
    const [mainBannerCount, setMainBannerCount] = useState(1);
    const [isPlaying, setIsPlaying] = useState(true);
    const [issueOpen, setIssueOpen] = useState(false);
    
    const mainBannerPlayAndPause = (e) =>{
        if (isPlaying) {
            swiper.autoplay.stop();
            setIsPlaying(false);
            document.querySelector('.visual_btn').classList.remove("pause");
            document.querySelector('.visual_btn').classList.add("play");
        } else {
            swiper.autoplay.start();
            setIsPlaying(true);
            document.querySelector('.visual_btn').classList.remove("play");
            document.querySelector('.visual_btn').classList.add("pause");            
        }
    }
    useEffect(() => {
        const swiperInstance = document.querySelector('.swiper-container').swiper;
        setSwiper(swiperInstance);
    }, [] );

    return (
        <div className='banner wrap'>        
            <Swiper
                className='mainBannerImgbox swiper-container'
                // wrapperTag="ul"
                modules={[Navigation, Autoplay, Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{ delay: 3000}}
                onSwiper={(swiper) => {
                    setMainBannerCount(swiper.slides.length);
                    setTimeout(() => {
                      swiper.params.navigation.prevEl = navigationPrevRef.current
                      swiper.params.navigation.nextEl = navigationNextRef.current
                      swiper.navigation.destroy()
                      swiper.navigation.init()
                      swiper.navigation.update()
                    })
                }}
                onSlideChange={(e) => {setMainBannerCurrentIndex(e.activeIndex+1);}}
                pagination={{
                    el: '.paging_wrap',
                    clickable: true}
                }
                navigation={{
                    prevEl: navigationPrevRef.current,
                    nextEl: navigationNextRef.current,
                  }}>
               
                <SwiperSlide tag="li">
                    <div className='imgafter'><img src="/images/main/banner1.png" alt='메인페이지 배너1'/></div>
                </SwiperSlide>    
                    
            </Swiper>
                
            {/* <div className="ss visual20_ctrl">           
                <div className='namebox'>
                    <div className='bannertxt'>
                        <p className='txt_m'>사회가 필요로 하는 전문인력 양성</p>                            
                        <p className='txt'>창신대학교 대학원</p>
                    </div>
                </div>                    
            </div> */}
            {/* <div className="navgroup">
                <div className="btngroup">
                    <div className="nav_number visual20_count"><span>{mainBannerCurrentIndex}</span> · {mainBannerCount}</div> 
                     
                    <a href="#" onClick={e => e.preventDefault} className="btn_main_slide prevbtn" ref={navigationPrevRef} tabindex='-1'/>                            
                    <a href="#" onClick={e => e.preventDefault} className="btn_main_slide nextbtn" ref={navigationNextRef} tabindex='-1' />   
                    <div type="button" className="pp pause visual_btn" title="슬라이드 재생 버튼" onClick={()=>mainBannerPlayAndPause()}></div>      
                </div>
                
            </div> */}
            <div className="banner_board">
                <div className='static'>
                    <div className='line'><Link to="/board/569/view?boardId=320">
                        <p>2026학년도</p>
                        <p>대학입학전형 시행계획 주요사항</p>
                    </Link></div>
                    <div><Link to="/board/569/view?boardId=288">
                        <p>2025학년도</p>
                        <p>대학입학전형 시행계획 주요사항</p>
                    </Link></div>
                </div>
                <div className='dynamic'>
                    <div className='area'>
                        <div className='issue'  onClick={() => !issueOpen && setIssueOpen(true)}>
                            <p>CSU ISSUE <span>3</span></p>
                            <div className='cancle' onClick={() => setIssueOpen(false)}><img src="/images/main/comm_more.png"/></div>
                        </div>
                        {issueOpen && <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainBannerComp;