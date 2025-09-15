import React, { useState, useEffect,useRef } from 'react';
import { Navigation, Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Link} from 'react-router-dom';
import {SERVER_URL} from 'context/config'; //

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/controller';

const MainBannerComp = (props) => {
    const [loading, setLoading] = useState(false);
    const [menucd, setMenucd] = useState(569);
    const [cate, setCate] = useState("");
    const [postList, setPostList] = useState([]);
    const listCate = ["공통","수시","정시","편입학","외국인"]; 
    
    const navigationPrevRef = React.useRef(null);
    const navigationNextRef = React.useRef(null);
    const [mainBannerCurrentIndex, setMainBannerCurrentIndex] = useState(1);
    const [swiper, setSwiper] = useState(null);
    
    const [mainBannerCount, setMainBannerCount] = useState(1);
    const [isPlaying, setIsPlaying] = useState(true);
    const [issueOpen, setIssueOpen] = useState(false);
     const videoRef = useRef(null);

  const handleEnded = () => {
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }, 2000); // 2초 딜레이 후 재생
  };   
    
     //이슈

    useEffect(() => {
        Init();
    },[]);

    const Init = async () =>{
        try{
            const res = await fetch(SERVER_URL+'/api/board/569/list?CATE='+cate,{method:"GET", headers:{'content-type':'application/json'}});
            const data = await res.json();
            setPostList(data?.getBoardList);          
            
        }catch(e){
            console.log(e);
        }
    }
    useEffect(() => {
        postList?.length != 0 && setIssueOpen(true);
    },[postList]);


    //배너 
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

    const handleSubmit = (e) => {
        alert("원서접수 기간이 아닙니다.");
        return;
    };

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
               
                {/* <SwiperSlide tag="li">
                    <div className='imgafter'><img src="/images/main/banner2.jpg" alt='메인페이지 배너1'/></div>
                </SwiperSlide>     */}
                <SwiperSlide tag="li"><div className='imgafter'>
                    <video width="100%" autoPlay muted playsinline={true} webkit-playsinline={true} controls={false}>
                        <source src="/images/main/banner1.mp4" type="video/mp4"/>
                    </video></div>
                </SwiperSlide> 
                
            </Swiper>
                    
            {/* 추가요구사항 by 김동성 팀장, 현혜원 선생 요청 20250905 */}
            <div className="Maincontain main-quick-menu">
                <div className="con-list">
                    <div className="item">
                        <div className="box">
                            <h3><span>수시모집</span></h3>
                            <span className="icon mot5-fptop"><em class="hid">모집요강 아이콘</em></span>
                            <div className="box-button">
                                <Link to="/early/guideline" class="cate1">모집요강</Link>
                                {/*<Link to="https://apply.jinhakapply.com/Notice/4143035/A" target='_blank' className="receipt">원서접수</Link>*/}
                                <Link onClick={()=>handleSubmit()}  className="receipt">원서접수</Link>
                                <Link to="https://ipsi.cs.ac.kr/ticket/index.do" target='_blank'>지원자 정보조회</Link>
                                <Link to="https://ipsi.cs.ac.kr/ratio/2026/1.do" target='_blank'>경쟁률</Link>
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="box">
                            <h3><span>정시모집</span></h3>
                            <span className="icon mot5-fptop"><em className="hid">모집요강 아이콘</em></span>
                            <div className="box-button">
                                <Link to="/regular/guideline" className="cate2">모집요강</Link>
                                <Link to="/regular/talk" className="">입학상담</Link>
                                <Link to="https://ipsi.cs.ac.kr/ticket/index.do" target='_blank'>지원자 정보조회</Link>
                                <Link to="https://ipsi.cs.ac.kr/ratio/2025/2.do" target='_blank'>경쟁률</Link>
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="box">
                            <h3><span>편입학</span></h3>
                            <span className="icon mot5-fptop"><em className="hid">모집요강 아이콘</em></span>
                            <div className="box-button">
                                <Link to="/transfer/notice" className="cate3">공지사항</Link>
                                <Link to="/transfer/talk" className="">입학상담</Link>
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="box">
                            <h3><span>입학정보</span></h3>
                            <span className="icon mot5-fptop"><em className="hid">모집요강 아이콘</em></span>
                            <div className="box-button">
                                <Link to="/assistant/notice" className="cate4">공지사항</Link>
                                <Link to="/assistant/brochure" className="">안내책자</Link>
                                <Link to="/early/result" className="">입시결과</Link>
                                <Link to="/assistant/talk" className="">입학상담</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*
            <div className="banner_board">
                <div className='static'>
                    <div className='line'><Link to="/board/569/view?boardId=328&menuId=569">
                        <p>2026학년도</p>
                        <p>대학입학전형 시행계획 주요사항</p>
                    </Link></div>
                    <div><Link to="/board/569/view?boardId=356&menuId=569">
                        <p>2027학년도</p>
                        <p>대학입학전형 시행계획 주요사항</p>
                    </Link></div>
                </div>
                <div className='dynamic'>
                    <div className='area'>
                        <div className='issue'  onClick={() => !issueOpen && setIssueOpen(true)}>
                            <p>CSU ISSUE <span>{postList?.length}</span></p>
                            <div className='cancle' onClick={() => setIssueOpen(false)}><img src="/images/main/comm_more.png"/></div>
                        </div>
                        {issueOpen  && <ul>
                             {postList.map((data, index)=> {                                                      
                                if(index < 5){
                                    return(
                                        <li>
                                            <Link to={"/board/"+data.MENU_CD+"/view?boardId="+data.BOARD_ID+"&menuId="+menucd}>
                                                <div className='title'>
                                                    <span className={'cata cate'+data.CATE}>{listCate[data.CATE]}</span>

                                                    {data.TITLE}
                                                </div>
                                            </Link>
                                        </li>
                                    )
                                }
                            })}
                        </ul>}
                    </div>
                </div>
            </div>
            */}
        </div>
    );
};

export default MainBannerComp;