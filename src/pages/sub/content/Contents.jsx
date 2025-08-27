import React, { useState, useEffect, useRef  } from 'react';
import {  Link, useParams, useLocation ,useNavigate  } from 'react-router-dom';
import { SERVER_URL } from "context/config";
import SubBannerComp from 'pages/common/components/subBannerComp';
import ContentMenuComp from 'pages/common/components/contentMenuComp';
// import PathbarComp from 'pages/common/components/pathbarComp';
import { Map, MapMarker } from "react-kakao-maps-sdk";

///////
const Sub = (props) => {    
    const params = useParams();
	const menuCd = params.menuCd;
    const [contentList, setContentList] = useState([]);
    const [menuList, setMenuList] = useState([]);
    const containerRef = useRef();
    const location = useLocation();
    const [result, setResult] = useState(false);
    let dep3_MC;let dep3_NM;

    const navigate = useNavigate();
    //const token = window.sessionStorage.getItem('accessToken');
    useEffect(() => {
       Init();
        window.scrollTo(0, 0);
    },[menuCd]);

    useEffect(() => {
        const containerEl = containerRef.current;
        if (containerEl) {
          const scripts = containerEl.getElementsByTagName('script');
          for (const script of scripts) {
            window.eval(script.innerHTML);
          }
        }
     },[contentList]);
      
    const Init = async () =>{
        try{
            const res1 = await fetch(SERVER_URL+'/api/menu/list',{method:"POST", headers:{'content-type':'application/json'}});
            const data1 = await res1.json();  
            setMenuList(data1.getMenuList);
            
            // const res = await fetch(SERVER_URL+"/api/contents/"+menuCd+"/view",{method:"GET", headers:{'content-type':'application/json'}});
            // const data = await res.json();  
            // setContentList(data.getContentsView);
            
        }catch(e){
            console.log(e);
        }
    }
    // function menu(menuCd) {
    //     let i
    //     for(i=0; i < menuList.length; i++){
    //         if(menuCd == menuList[i].MENU_CD){
    //             if(menuList[i].DEPTH == 4){
    //                 dep3_MC = menuList[i].PARENT_MENU_CD 
    //                 menu(menuList[i].PARENT_MENU_CD)
    //             }
    //             if(menuList[i].DEPTH == 3){
    //                 return dep3_NM = menuList[i].MENU_NM 
    //             }
    //             return  
    //         }
    //     }    
    // }
        
    return(
        <>
            <SubBannerComp menuCd={menuCd}/>
            <div className='Subcontain'>
                <ContentMenuComp />                          
                <div className='contentBox'>
                    {/* <div dangerouslySetInnerHTML={{ __html:  contentList[0]?.CONTENT }} ref={containerRef}></div>  */}
                    
                    {/* <div class='contents_none'>
                        <img src="/images/sub/content/contents_none.png"/>
                        <p class="title">자료를 준비하고 있습니다.</p>
                        <p>더 많은 서비스와 정확한 정보를 전해드리기 위해 준비중입니다.</p>
                        <p>이용에 불편을 드려 죄송합니다.</p>                            
                    </div>    */}
                    
                    <div className='content_title'>2026학년도 수시 모집요강</div> 
                    <ul className='guideline_file'>
                        <li>모집요강 다운로드</li>
                        <li>확대보기</li>
                    </ul>
                    <div className='guideline_pdf_box'>
                        <div className='guideline_pdf'></div> 
                        <div className='guideline_index'>
                            <p>Contents Index</p>
                            <p>선택하면 각 페이지로 이동합니다.</p>
                            <ul>
                                <li></li>
                            </ul>
                        </div>                   
                    </div>
                    
                </div>
            </div>
        </>
        
    )
}

export default Sub;