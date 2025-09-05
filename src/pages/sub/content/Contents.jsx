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
	//const menuCd = menuInfo?.MENU_CD;
    const [page, setPage] = useState(1);

    const [guide, setGuide] = useState([]); //달별로 분리된 학사일정 리스트
    const [guideBookMark, setGuideBookMark] = useState([]); //달별로 분리된 학사일정 리스트
    const [gubun, setGubun] = useState(""); //달별로 분리된 학사일정 리스트
    const [contitle, setContitle] = useState(""); //달별로 분리된 학사일정 리스트
    const [loaded, setLoaded] = useState(false);
    const getMenucd = () => {
        if(location.pathname == '/early/guideline'){return '550';}
        else if(location.pathname == '/early/result'){return '554';}
        else if(location.pathname == '/regular/guideline'){return '555';}
        else if(location.pathname == '/regular/result'){return '559';}
        else if(location.pathname == '/transfer/guideline'){return '564';}
        else if(location.pathname == '/transfer/result'){return '568';}
        else if(location.pathname == '/international/guideline'){return '560';}
    };

    const [menuCd, setMenuCd] = useState(getMenucd());
    function setting(menuCd){
        switch (menuCd) {
        case '550' :  setGubun(1);setContitle("학년도 수시모집요강"); return
        case '555' :  setGubun(2);setContitle("학년도 정시모집요강"); return 
        case '564' :  setGubun(3);setContitle("학년도 편입학모집요강");return
        case '560' :  setGubun(4);setContitle("학년도 외국인모집요강");return
        case '554' :  setGubun(-1);setContitle("전년도 수시 입시결과");return
        case '559' :  setGubun(-2);setContitle("전년도 정시 입시결과");return
        case '568' :  setGubun(-3);setContitle("전년도 편입학 입시결과");return
        case '591' :  setGubun(0);setContitle("학년도 대학 및 학과소개"); return//안내책자return
        }
     }
    

     useEffect(() => {
        if(menuInfo?.MENU_CD != null){
            setMenuCd(menuInfo?.MENU_CD);
        }

    },[menuInfo]);

    useEffect(() => {
       if(menuCd != null){
        setting(menuCd);
       }

    },[menuCd]);

    useEffect(() => {
        {gubun != "" &&
        setting(menuCd);
        Init();
        setPage(1)
        window.scrollTo(0, 0);}
    },[gubun]);

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    useEffect(() => {
        if(gubun != ''){
            Init();
        }

    },[page]);

   
      
    const Init = async () =>{
        try{
            let JsonArray = new Array();
            let JsonObject = new Object;
            JsonObject.GUBUN = gubun; //0: 안내책자, 1 : 수시, 2: 정시, 3: 편입학, 4: 외국인
            JsonArray.push(JsonObject);  
            let res = await fetch(SERVER_URL+'/api/guide/view',{method:"POST", headers:{'content-type':'application/json'}, body : JSON.stringify(JsonArray)});
            const data = await res.json();

            setGuide(data.getGuideView[0]);
            setGuideBookMark(data.getGuideBookMarkList);
        }catch(e){
            console.log(e);
        }
    }
    const handleLoad = () => {
        setLoaded(true);
    };
    const handleFileDown = (src) => window.open(src, "self");

    return(
        <>
            <SubBannerComp menuCd={menuCd}/>
            <div className='Subcontain'>
                <ContentMenuComp menuCd={menuCd}/>                          
                <div className='contentBox'>

                    {[550, 555, 564, 560, 554, 559, 568,591].some(role => menuCd?.includes(role))  &&<>
                    <div className='cont-h mgB40'>{gubun>=0 && guide?.YEAR}{contitle}</div> 
                    <ul className='guideline_file'>
                        <li className='filedown' ><a  onClick={() => handleFileDown(SERVER_URL+"/api/guide/download?YEAR="+guide?.YEAR+"&GUBUN="+gubun)} download>{gubun >= 0 ? '모집요강 다운로드' : '다운로드'}<img src='/images/sub/content/guideline_down.png'/></a></li>
                        <li className='filezoom' onClick={() => handleFileDown(SERVER_URL+"/api/guide/pdfview?GUBUN="+gubun)}>확대보기<img src='/images/sub/content/guideline_zoom.png'/></li>
                    </ul>
                    <div className='guideline_pdfview'>
                        <div className={gubun >= 0 ? 'pdfview' : 'pdfview noIndex'}>
                            <iframe key={page} src={SERVER_URL+"/api/guide/pdfview?GUBUN="+gubun+`#page=${page}&zoom=page-width`} type="application/pdf" title="PDF Viewer" aria-label="example" width="100%" height="800" style={{ display: loaded ? 'block' : 'none' }} onLoad={handleLoad}/>
                        </div> 
                         {gubun >= 0 && <div className='pdfindex'>
                            <p>Contents Index</p>
                            <p className='paraphrase'>선택하면 각 페이지로 이동합니다.</p>
                            <ul>{guideBookMark?.map((data, index) =>(
                                <li key={index} className={data.BOOKMARK_LEVEL == "1" ?'level1':""} onClick={() => handlePageChange(data.BOOKMARK_PAGE)}>{data.BOOKMARK_TITLE}</li>))}
                            </ul>
                        </div>}                
                    </div>
                    </>}
                    


                    {/*원서접수 카테고리
                    <ul className='cont-cate'>
                        <li className='cate active' onClick={() => showTab(0)}>수시</li>
                        <li className='cate' onClick={() => showTab(1)}>정시</li>
                        <li className='cate' onClick={() => showTab(2)}>편입학</li>
                    </ul>*/}
                    {/* ---수시원서접수  */}
                    {menuInfo?.MENU_CD == 587 &&<>
                    <div className='cont-catebox'>
                        <div className='cont-area'>     
                            <div className='cont-h mgB20'>인터넷 원서접수</div>
                            <div className='is-wauto-box mgB'><table className='cont-table'>
                                <colgroup>
                                    <col style={{width:"20%"}}/>
                                    <col style={{width:"20%"}}/>
                                    <col style={{width:"20%"}}/>
                                    <col style={{width:"20%"}}/>
                                    <col style={{width:"20%"}}/>
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
                                            <td><Link to='https://apply.jinhakapply.com/Notice/4143035/A' target='_blank'><img src='https://nadmin.jinhakapply.com/Banner/Images/s0_ap_mv4.gif' border='0'/></Link></td>
                                            <td><Link href='https://apply.jinhakapply.com/Common/ApplySearch/4143035' target='_blank'><img src='https://nadmin.jinhakapply.com/Banner/Images/s0_ac_mv4.gif' border='0'/></Link></td>
                                            <td><Link href='https://sdoc.jinhakapply.com/Submit/frmSubmitStu.aspx?UnivServiceID=4143035' target='_blank'><img src='https://nadmin.jinhakapply.com/Banner/Images/s0_dc_mv4.gif' border='0'/></Link></td>
                                            {/*<td colSpan={3}>현재는 원서접수 기간이 아닙니다</td>*/}
                                        </tr>
                                    </tbody> 
                            </table></div>
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
                    </>}
                    {/* ---정시원서접수  */}
                    {menuInfo?.MENU_CD == 588 &&<>
                    <div className='cont-catebox'>
                        <div className='cont-area'>     
                            <div className='cont-h mgB20'>인터넷 원서접수</div>
                            <div className='is-wauto-box mgB'><table className='cont-table'>
                                <colgroup>
                                    <col style={{width:"20%"}}/>
                                    <col style={{width:"20%"}}/>
                                    <col style={{width:"20%"}}/>
                                    <col style={{width:"20%"}}/>
                                    <col style={{width:"20%"}}/>

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
                                            <td><Link to='https://apply.jinhakapply.com/Notice/4143035/A' target='_blank'><img src='https://nadmin.jinhakapply.com/Banner/Images/s0_ap_mv4.gif' border='0'/></Link></td>
                                            <td><Link href='https://apply.jinhakapply.com/Common/ApplySearch/4143035' target='_blank'><img src='https://nadmin.jinhakapply.com/Banner/Images/s0_ac_mv4.gif' border='0'/></Link></td>
                                            <td><Link href='https://sdoc.jinhakapply.com/Submit/frmSubmitStu.aspx?UnivServiceID=4143035' target='_blank'><img src='https://nadmin.jinhakapply.com/Banner/Images/s0_dc_mv4.gif' border='0'/></Link></td>
                                            {/*<td colSpan={3}>현재는 원서접수 기간이 아닙니다</td>*/}
                                        </tr>
                                    </tbody> 
                            </table></div>
                        </div>
                    </div>
                    </>}
                    {/* ---편입학 원서접수  */}
                    {menuInfo?.MENU_CD == 590 &&<>
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
                    </>}
                </div>
            </div>
        </>
        
    )
}

export default Sub;