import React, { useState, useEffect, useRef  } from 'react';
import {  Link, useParams, useLocation ,useNavigate  } from 'react-router-dom';
import { SERVER_URL } from "context/config";
import SubBannerComp from 'pages/common/components/subBannerComp';
import ContentMenuComp from 'pages/common/components/contentMenuComp';
// import PathbarComp from 'pages/common/components/pathbarComp';
import { Map, MapMarker } from "react-kakao-maps-sdk";
import {getMenuInfo} from "assets/js/utils";
//import qs from 'qs';

///////
const Sub = (props) => {
    const location = useLocation();
    let menuInfo = getMenuInfo(location.pathname + location.search);
    //const query = qs.parse(location.search, {ignoreQueryPrefix: true});
    //const params = useParams();
	//const menuCd = params.menuCd;
    const [menuList, setMenuList] = useState([]);
    const [page, setPage] = useState(1);
    

    
    //const token = window.sessionStorage.getItem('accessToken');
    useEffect(() => {
       Init();
        window.scrollTo(0, 0);
    },[menuInfo?.MENU_CD]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  useEffect(() => {
        Init()
    },[page]);

   
      
    const Init = async () =>{
        try{
            console.log(menuInfo?.MENU_CD);
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
   
    function showTab(index) {
        // 모든 탭 버튼과 콘텐츠를 숨기기
        var buttons = document.querySelectorAll('.cate');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active');
        }
        // 선택한 탭 버튼과 콘텐츠 활성화
        buttons[index].classList.add('active');
    }
    
    return(
        <>
            <SubBannerComp menuCd={menuInfo?.MENU_CD}/>
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
                    
                    {menuInfo?.MENU_CD == 550 &&<>
                    <div className='cont-h mgB40'>2026학년도 수시모집요강</div> 
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
                    </>}

                    {menuInfo?.MENU_CD == 555 &&<>
                    <div className='cont-h mgB40'>2026학년도 정시모집요강</div> 
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
                    </>}

                    {menuInfo?.MENU_CD == 564 &&<>
                    <div className='cont-h mgB40'>2026학년도 편입학모집요강</div> 
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
                    </>}

                    {menuInfo?.MENU_CD == 560 &&<>
                    <div className='cont-h mgB40'>2026학년도 외국인모집요강</div> 
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
                    </>}

                    <ul className='cont-cate'>
                        <li className='cate active' onClick={() => showTab(0)}>수시</li>
                        <li className='cate' onClick={() => showTab(1)}>정시</li>
                        <li className='cate' onClick={() => showTab(2)}>편입학</li>
                    </ul>
                    {/* <수시원서접수  */}
                    <div className=''>     
                        <div className='cont-h mgB20'>인터넷 원서접수</div>
                        <table className='cont-table mgB'>
                            <colgroup>
                                <col style={{width:"18%"}}/>
                                <col style={{width:"18%"}}/>
                                <col style={{width:"20%"}}/>
                                <col style={{width:"30%"}}/>
                            </colgroup>
                                <thead>                                
                                    <tr>
                                        <th colSpan={2}>구분</th>
                                        <th>원서접수</th>
                                        <th>접수확인</th>
                                        <th>제출서류확인</th>
                                    </tr>
                                </thead>
                                <tbody> 
                                    <tr>
                                        <th>수시모집</th>
                                        <th>진학어플라이</th>
                                        <td colSpan={3}>현재는 원서접수 기간이 아닙니다</td>
                                    </tr>
                                </tbody> 
                        </table>
                         
                        <div className='cont-h mgB20'>접수기간</div>
                        <table className='cont-table mgB'>
                            <colgroup>
                                <col style={{width:"40%"}}/>
                                <col style={{width:"60%"}}/>
                                
                            </colgroup>
                                <thead>                                
                                    <tr>
                                        <th>구분</th>
                                        <th>일자</th>
                                        
                                    </tr>
                                </thead>
                                <tbody> 
                                    <tr>
                                        <th>접수기간</th>
                                        <td><p>2025. 9. 8(월) ~ 9.12(금)</p><p>(24시간 접수가능, 마감일은 18:00까지)</p></td>
                                    </tr>
                                </tbody> 
                        </table>
                        <div className='cont-h mgB20'>접수방법 및 절차</div>
                        <div className='con-m-num'></div>
                        <div className='con-m-num'></div>

                        <div className='cont-h mgB20'>접수방법 및 절차</div>
                        
                    </div>


                    
                </div>
            </div>
        </>
        
    )
}

export default Sub;