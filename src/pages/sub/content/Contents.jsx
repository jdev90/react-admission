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
    const [page, setPage] = useState(1);

    const navigate = useNavigate();
    //const token = window.sessionStorage.getItem('accessToken');
    useEffect(() => {
       Init();
        window.scrollTo(0, 0);
    },[menuCd]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
    console.log(1)
  };

  useEffect(() => {
        Init()
    },[page]);

   
      
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
    
    const handleFileDown = (src) => window.open(src, "self");
   
    
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
                    
                    <div className='cont-h'>2026학년도 수시모집요강</div> 
                    <ul className='guideline_file'>
                        <li className='filedown' ><a href="/pdf/pdf_guideline.pdf" download>모집요강 다운로드<img src='/images/sub/content/guideline_down.png'/></a></li>
                        <li className='filezoom' onClick={() => handleFileDown("/pdf/pdf_guideline.pdf")}>확대보기<img src='/images/sub/content/guideline_zoom.png'/></li>
                    </ul>
                    <div className='guideline_pdfview'>
                        <div className='pdfview'>
                            <iframe key={page} src={`/pdf/pdf_guideline.pdf#page=${page}`} type="application/pdf" title="PDF Viewer" aria-label="example" width="100%" height="800"/>
                        </div> 
                        <div className='pdfindex'>
                            <p>Contents Index</p>
                            <p className='paraphrase'>선택하면 각 페이지로 이동합니다.</p>
                            <ul>
                                <li onClick={() => handlePageChange(1)}>2026 대학 수시모집 주요 변경사항</li>
                                <li onClick={() => handlePageChange(2)}>수시모집 요약</li>
                                <li>전형일정</li>
                                <li>모집단위 및 모집인원</li>
                                <li>유의사항</li>
                                <li>전형안내</li>
                                <li>합격자생활기록부 반영방법</li>
                            </ul>
                        </div>                   
                    </div>
                    
                </div>
            </div>
        </>
        
    )
}

export default Sub;