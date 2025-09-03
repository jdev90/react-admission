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
    const [guide, setGuide] = useState([]); //달별로 분리된 학사일정 리스트
    const [guideBookMark, setGuideBookMark] = useState([]); //달별로 분리된 학사일정 리스트
    
    

    
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
            const res1 = await fetch(SERVER_URL+'/api/menu/list',{method:"POST", headers:{'content-type':'application/json'}});
            const data1 = await res1.json();  
            setMenuList(data1.getMenuList);
            
            // const res = await fetch(SERVER_URL+"/api/contents/"+menuCd+"/view",{method:"GET", headers:{'content-type':'application/json'}});
            // const data = await res.json();  
            // setContentList(data.getContentsView);
            let JsonArray = new Array();
            let JsonObject = new Object;
            JsonObject.GUBUN = 1; //0: 안내책자, 1 : 수시, 2: 정시, 3: 편입학, 4: 외국인
            JsonArray.push(JsonObject);  
            let res = await fetch(SERVER_URL+'/api/guide/view',{method:"POST", headers:{'content-type':'application/json'}, body : JSON.stringify(JsonArray)});
            const data = await res.json();
            setGuide(data.getGuideView);
            setGuideBookMark(data.getGuideBookMarkList);
        }catch(e){
            console.log(e);
        }
    }
    
    const handleFileDown = (src) => window.open(src, "self");
   
    function showTab(index) {
        // 모든 탭 버튼과 콘텐츠를 숨기기
        var buttons = document.querySelectorAll('.cate');
        var box = document.querySelectorAll('.cont-catebox');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active');
            box[i].classList.remove('active');
        }
        // 선택한 탭 버튼과 콘텐츠 활성화
        buttons[index].classList.add('active');
        box[index].classList.add('active');
    }
    
    return(
        <>
            <SubBannerComp menuCd={menuInfo?.MENU_CD}/>
            <div className='Subcontain'>
                <ContentMenuComp menuCd={menuInfo.MENU_CD}/>                          
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
                            {/*<iframe key={page} src={`/pdf/pdf_guideline.pdf#page=${page}`} type="application/pdf" title="PDF Viewer" aria-label="example" width="100%" height="800"/>*/}
                            <iframe key={page} src={SERVER_URL+"/api/attach/view?PATH=/guide/&FILE_NM=E2D7806D540B4E558CBE5ADF8F8B0146&CREATE_ID=30072&ORI_FILE_NM=2026_nonscheduled.pdf&YEAR=2025"} type="application/pdf" title="PDF Viewer" aria-label="example" width="100%" height="800"/>

                        </div> 
                        <div className='pdfindex'>
                            <p>Contents Index</p>
                            <p className='paraphrase'>선택하면 각 페이지로 이동합니다.</p>
                            <ul>{guideBookMark?.map((data, index) =>(
                                <li key={index} onClick={() => handlePageChange(data.BOOKMARK_PAGE)}>{data.BOOKMARK_TITLE}</li>))}
                                
                            </ul>
                            {/*<ul>
                                <li onClick={() => handlePageChange(1)}>2026 대학 수시모집 주요 변경사항</li>
                                <li onClick={() => handlePageChange(2)}>수시모집 요약</li>
                                <li>전형일정</li>
                                <li>모집단위 및 모집인원</li>
                                <li>유의사항</li>
                                <li>전형안내</li>
                                <li>합격자생활기록부 반영방법</li>
                            </ul>*/}
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
                    <div className='cont-catebox active'>
                        <div className='cont-area'>     
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
                        </div>
                        <div className='cont-area'>  
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
                        </div>
                        <div className='cont-area'>  
                            <div className='cont-h mgB20'>접수방법 및 절차</div>
                            <div className='cont-m-num'>인터넷접수</div>
                            <div className='cont-s mgB5'>대행업체 : 진학사 / T. 1544-7715</div>
                            <div className='cont-s mgB5'>접수절차 : 24시간 접수가능(단, 원서접수 마감일은 18:00까지)</div>
                            <ul className='cont-query mgB20'>
                                <li>회원가입/대학선택 <p>(대행업체)</p></li>
                                <li>원서작성 <p>(작성내용확인)</p></li>
                                <li>전형료 및 <p>수수료 결제</p></li>
                                <li>원서접수확인 <p>(모집단원, 전형등)</p></li>
                                <li>서류제출 <p>(해당자)</p></li>
                            </ul>
                            <div className='cont-s mgM'>서류제출 : (51352) 경남 창원시 마산회원구 팔용로 262 창신대학교 입학홍보처</div>
                            <div className='cont-m-num'>방문접수</div>
                            <div className='cont-s mgB5'>장 소 : 본 대학교 입학홍보처(1호관, 1층)</div>
                            <div className='cont-s mgB'>접수시간 : 평일 09:00 ~ 18:00 까지</div>
                        </div>
                        <div className='cont-area'> 
                            <div className='cont-h mgB20'>유의사항</div>
                            <div className='cont-s mgB5'>입학원서는 지원자 본인만 작성하여 지원할 수 있으며, 타인 및 대리접수는 불가능함.</div>
                            <div className='cont-s mgB5'>원서 작성 전에 모집요강과 유의사항을 반드시 숙지한 후에 입학원서를 작성하여야 함.</div>
                            <div className='cont-s mgB5'>원서 작성시 나타나는 확인 문구 등을 반드시 확인하고 모두 정확하게 작성하여야 함.</div>
                            <div className='cont-s mgB5'>입력한 내용이 사실과 다를 경우 지원자에게 책임이 있으며 본 대학교에서는 책임지지 않음.</div>
                            <div className='cont-s mgB5'>접수 후 입학원서의 수정 및 취소가 불가하므로 반드시 입력 내용을 확인하고 접수하여야 함.</div>
                            <div className='cont-s mgB5'>전형료를 결제해야 접수가 완료되며, 수험표 및 입학원서 등의 출력이 가능함.</div>
                            <div className='cont-s mgB'>인터넷접수를 통해 지원한 경우 본인이 지원한 원서접수 대행업체 홈페이지에서 접수 여부를 확인하여야 하며, 미확인으로 인해 발생하는 문제에 대해서는 지원자에게 책임이 있음.</div>
                        </div>
                        <div className='cont-area'> 
                            <div className='cont-h mgB20'>서류 제출안내</div>
                            <div className='cont-m-num'>제출기간</div>
                            <div className='cont-s mgM'>2025. 9. 8(월) 09시 ~ 9. 22(월) 18시</div>
                            <div className='cont-m-num'>제출대상 : 아래 해당자</div>
                            <div className='cont-s mgB5'>학생부 온라인 제공 미동의자(미제공 학교 포함) 및 2022년 2월 이전 졸업자 : 학교생활기록부 1부</div>
                            <div className='cont-s mgB5'>검정고시 출신자 : 검정고시 합격증명서 1부, 성적증명서 1부 (온라인 제공 동의자 제외)</div>
                            <div className='cont-s mgB5'>외국 고교 졸업(예정)자 : 외국 고교 졸업(예정) 증명서, 성적증명서 각 1부</div>
                            <div className='cont-s mgB5'>정원 외 특별전형 지원자 : 해당 지원자격별 제출서류</div>
                            <div className='cont-s mgM'>기타 : 지원자격 등 확인 및 검증 내실화를 위해 추가로 요청한 제출서류, 기타 서류제출 대상자</div>
                            <div className='cont-m-num'>제출방법</div>
                            <div className='cont-s mgB5'>등기우편(제출마감일 소인 유효), 방문제출(기간 중 평일 업무시간에 한함)</div>
                            <div className='cont-s mgM'>서류 제출 후 반드시 도착 여부를 본인이 직접 확인하여야 함 (미도착에 따른 불이익에 대해 책임지지 않음)</div>

                            <div className='cont-m-num'>제출장소</div>
                            <div className='cont-s mgM'>경남 창원시 마산회원구 팔용로 262 창신대학교 입학홍보처(055-250-3114)</div>
                            <div className='cont-m-num'>유의사항</div>
                            <div className='cont-s mgM'>제출서류 미제출자는 불합격 처리함</div>
                        </div>
                    </div>
                    {/* <정시원서접수  */}
                    <div className='cont-catebox'>
                        <div className='cont-area'>     
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
                                            <th>정시(가군)</th>
                                            <th>진학어플라이</th>
                                            <td colSpan={3}>현재는 원서접수 기간이 아닙니다</td>
                                        </tr>
                                    </tbody> 
                            </table>
                        </div>
                    </div>
                    {/* <편입학 원서접수  */}
                    <div className='cont-catebox'>
                        <div className='cont-area'>     
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
                                            <td>2025. 7. 15.(화) ~ 7. 17.(목)</td>
                                        </tr>
                                    </tbody> 
                            </table>
                        </div>
                        <div className='cont-area'>  
                            <div className='cont-h mgB20'>접수방법 및 절차</div>
                            <div className='cont-m-num'>방문, 우편, 이메일접수</div>
                            <div className='cont-s mgB5'>장소 : 본 대학교 교무처 교무팀 (본관 1층)</div>
                            <div className='cont-s mgB5'>이메일 : minji1215@cs.ac.kr</div>
                            <div className='cont-s mgB'>이메일 : minji1215@cs.ac.kr</div>
                        </div>
                        <div className='cont-area'>  
                            <div className='cont-h mgB20'>서류 제출안내</div>
                            <div className='cont-m-num'>제출기간</div>
                            <div className='cont-s mgM'>2025. 7. 15.(화) 10:00 ~ 7. 17.(목) 16:00</div>
                            <div className='cont-m-num'>제출방법</div>
                            <div className='cont-s mgM'>방문, 우편, 이메일 제출</div>
                            <div className='cont-m-num'>제출장소</div>
                            <div className='cont-s mgM'>경남 창원시 마산회원구 팔용로 262 창신대학교 교무처 교무팀(055-250-3106, 4)</div>

                        </div>
                    </div>


                    
                </div>
            </div>
        </>
        
    )
}

export default Sub;