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


const MainGuideBookComp = (props) => {  
    const [guideList, setGuideList] = useState([]); //달별로 분리된 학사일정 리스트
    const [loading, setLoading] = useState(false); //달별로 분리된 학사일정 리스트

    const bookList = [
        {title: "2025 CSU 신입생 정시모집요강",img:"/images/main/book_img1.png"},
        {title: "2025 CSU 신입생 수시모집요강",img:"/images/main/book_img2.png"},
        {title: "2025 창신대학교 후기 폅입학 모집요강",img:"/images/main/book_img3.png"},
    ];

    useEffect(() => {
       setLoading(false);
       Init();
     },[]);

    const Init = async () =>{
        try{
            let JsonArray = new Array();
            let JsonObject = new Object;
            //JsonObject.GUBUN = 1; //0: 안내책자, 1 : 수시, 2: 정시, 3: 편입학, 4: 외국인
            JsonArray.push(JsonObject);  
            let res = await fetch(SERVER_URL+'/api/guide/view',{method:"POST", headers:{'content-type':'application/json'}, body : JSON.stringify(JsonArray)});
            const sudata = await res.json();
            setGuideList(sudata?.getGuideView);
            console.log(sudata?.getGuideView);
        }catch(e){
            console.log(e);
        }
    }


    const handleFileDown = (src) => window.open(src, "self");

    return(
        <>
            <div className='bkBgc'>
                <div className='Maincontain MainGuideBook'>                        
                    <div className='MainTitle'>
                        <p>창신대학교의 입시 관련 주요 서비스입니다.</p>
                        <h1>CSU<span>안내책자</span></h1>
                    </div>
                    <div className='guide_swiper'>
                        {guideList.length > 0 && (
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
                            
                           {guideList?.map((data, index) =>{
                            const bookNm = data.ORI_FILE_NM.slice(0,data.ORI_FILE_NM.length - 4);
                            console.log(data)
                            return(
                                <SwiperSlide key={index}><img className='slide-bk' onClick={() => handleFileDown(SERVER_URL+"/api/guide/pdfview?GUBUN="+data.GUBUN)} src={SERVER_URL+"/api/guide/thumnail?url=https://cfile.cs.ac.kr/upload/fileserver/admission/"+data.PATH+"/"+data.FILE_NM}/><div className='guide_title'>{bookNm}</div></SwiperSlide>
                            )
                            })}
                        </Swiper>
                        )}
                    </div>
                </div>    

            </div>        

           
        </>
        
    )
}

export default MainGuideBookComp;