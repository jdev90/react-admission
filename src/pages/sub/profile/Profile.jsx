import React, { useState, useEffect, useRef  } from 'react';
import {  Link, useParams } from 'react-router-dom';
import { SERVER_URL } from "context/config";
// import URL from 'context/url';

import SubBannerComp from 'pages/common/components/subBannerComp';
import SubMenuComp from 'pages/sub/content/common/subMenuComp';
//**권한**//
import { writePermissionCheck, deletePermissionCheck, getTokenData, getUserRoles } from 'assets/js/jwt';
//**권한**//
const Profile = (props) => {    
    const params = useParams();
	const menuCd = params.menuCd;
    const [contentList, setContentList] = useState([]);
    const [more, setMore] = useState(false);
    const [id, setId] = useState("");
    // const [careerResult, setCareerResult] = useState("");
    // const [lines, setLines] = useState([]);
    // const containerRef = useRef();
    let firstPart = '';
    let secondPart = '';
    // let result = [];

    //**권한**//
    const [writePermission, setWritePermission] = useState(false);
    const [deletePermission, setDeletePermission] = useState(false);
    const token = window.sessionStorage.getItem('accessToken'); 
    //**권한**//

    useEffect(() => {
        //**권한**//
        setWritePermission(false);
        setDeletePermission(false);
        if (token) {
            setWritePermission(writePermissionCheck(token, menuCd)); // 권한 확인
            // userData = getTokenData(token); 
        }
        //**권한**//

       Init();
        window.scrollTo(0, 0);
        setMore(false);
    },[menuCd]);   
     
      
    const Init = async () =>{
        try{
            const res = await fetch(SERVER_URL+"/api/profile/"+menuCd+"/list",{method:"POST", headers:{'content-type':'application/json'}});
            const data = await res.json();  
            setContentList(data.getProfileList);
        }catch(e){
            console.log(e);
        }
    }
    
    const handleDelete = async (id, menu_cd) => {
        if(window.confirm("삭제된 게시글들은 복구할 수 없습니다.\n게시글을 삭제하시겠습니까?")){        
            let JsonArray = new Array();
            let JsonObject = new Object;
            JsonObject.MENU_CD = menuCd;//
            JsonObject.ID = id;//
            JsonArray.push(JsonObject);

            const res = await fetch(SERVER_URL+'/api/profile/'+menuCd+'/delete', {
                method: "POST",
                headers : {
                    "Content-Type" : "application/json;charset=utf-8;"
                }, 
                body : JSON.stringify(JsonArray)
            });
            const data = await res.json(); 
            if(data?.MSG == "SUCCESS"){Init()}
        }                
    }
    const nameSplit = async (name) => {
        const firstSpaceIndex = name.indexOf(' ');

        firstPart = '';
        secondPart = '';

        if (firstSpaceIndex !== -1) {
        firstPart = name.slice(0, firstSpaceIndex);
        secondPart = name.slice(firstSpaceIndex + 1);
        } else {
        firstPart = name; // 띄어쓰기 없으면 전체가 앞부분
        secondPart = '';
        }
    }

    // function careerSplit(career){
    //     // lines = career.split('\n').filter(line => line.trim() !== '');
    //     const splitLines = career
    //     .split('\n')
    //     .map(line => line.trim())
    //     .filter(line => line !== '');

    //     setLines(splitLines);
        
    // }

    
    function parseCareerBlocks(careerText) {
        const blocks = careerText.split(/\n(?=\[)/g); // [로 시작하는 줄 앞에서 블럭 나누기
        const elements = [];

        blocks.forEach((block, index) => {
            const lines = block.split('\n');

            // 첫 줄에서 제목 추출
            const trimmed = lines[0].trim(); // 💡 여기 trim 사용
            const titleMatch = trimmed.match(/^\[([^\]]+)\]$/);
            if (!titleMatch) return; // 제목 형식 아니면 건너뜀

            const title = titleMatch[1];
            const content = lines.slice(1).join('\n').trim(); // 나머지 줄은 그대로 <pre>에

            elements.push(<p key={`title-${index}`}>{title}</p>);
            elements.push(<pre key={`pre-${index}`}>{content}</pre>);
        });

        return elements;
        }

    
    return(
        <>
            <SubBannerComp menuCd={menuCd}/>
            <div className='subcontain'>
                <div className='infocontain'>
                    <div className='contents_area'>
                        <div className='contentBox'>
                            <SubMenuComp/>
                            {writePermission &&                            
                            <div className='viewBtn writeBtn'>                            
                                <Link to={"/profile/"+menuCd+"/write"}><div className=''>교수진등록</div></Link>        
                            </div>}

                            {contentList.length == 0 && <>
                              <div class='contents_none'>
                                <img src="/images/sub/content/contents_none.png"/>
                                <p class="title">자료를 준비하고 있습니다.</p>
                                <p>더 많은 서비스와 정확한 정보를 전해드리기 위해 준비중입니다.</p>
                                <p>이용에 불편을 드려 죄송합니다.</p>                            
                                </div>  
                           </>}
                                                      

                            <ul class="faculty gaebyeol">
                                {contentList.map((data, index)=>{
                                    nameSplit(data.NAME);
                                    return(
                                    <>
                                    {writePermission && 
                                    <li className='btn'>                            
                                        <div className='btn1'><Link to={"/profile/"+menuCd+"/write?id="+data.ID}>수정</Link></div> <div className='btn2'><p onClick={()=>handleDelete(data.ID, menuCd)}>삭제</p></div>     
                                    </li>}
                                    <li className="faculty_box">
                                        <div className='img'><img src={data.SAJIN != '' ? data.SAJIN : '/images/sub/content/faculty.png'}/></div>    
                                        <div className='txt'>                                
                                            <div className="txt1">{firstPart} <span> {secondPart}</span></div>
                                            <div className="txt2"><p className="h">학위</p><p>{data.EDUCATION}</p></div> 
                                            <div className="txt2 row2"><p className="h">연구분야</p><p>{data.RESEARCH} </p></div> 
                                        </div>
                                        <div className='con'>
                                            <div className='txt'>
                                                <div className="phone"><span>연락처</span>{data.PHONE}</div>
                                                <div className="room"><span>연구실</span>{data.ROOM}</div>
                                                <div className="more" onClick={()=>(setMore(true),setId(data.ID))}><img src='/images/sub/content/p_icon3.png'/></div>
                                            </div>
                                        </div>
                                    </li>
                                    
                                    </>
                                    )
                                })}
                            </ul> 
                            {more && 
                            <>
                            {contentList.map((data, index)=>{
                                if(id == data.ID){
                                const txt = parseCareerBlocks(data.CAREER)
                                return(
                                <div className="faculty_more_back">
                                    <div className="faculty_more">
                                        <img className='back' src="/images/sub/content/p_close.png" onClick={()=>setMore(false)}/>
                                        <div className='top'>
                                            <div className='col img'><img src={data.SAJIN != '' ? data.SAJIN : '/images/sub/content/faculty.png'}/></div>  
                                            <div className='col txt'>
                                                <div className="name">{data.NAME}</div>
                                                <div className="con">
                                                    <div className="phone"><span>연락처</span>{data.PHONE}</div>
                                                    <div className="room"><span>연구실</span>{data.ROOM}</div>
                                                    <div className="email"><span>이메일</span>{data.MAIL}</div>
                                                </div> 
                                            </div>
                                        </div>
                                        <div className='profile_table_area'>
                                        <ul className='profile_table'>
                                            <li><p>담당과목</p><div>{data.GWAMOK != "" ?data.GWAMOK:"-"}</div></li>
                                            <li><p>학위</p><div>{data.EDUCATION != "" ?data.EDUCATION:"-"}</div></li>
                                            <li><p>연구분야</p><div>{data.RESEARCH != "" ?data.RESEARCH:"-"}</div></li>
                                            <li><p>주요경력</p>
                                                <div className='career'>
                                                    <div>{data.CAREER != "" ?txt:"-"}</div>
                                                    {/* <p>논문</p>
                                                    <ul>
                                                        <li>외래 간호서비스 품질에 관한 연구(2011, 석사학위논문)</li>
                                                        <li>성조숙증 아동 어머니의 돌봄 경험: Q 방법론적 접근(2017, 박사학위논문)</li>
                                                        <li>성조숙증 아동 어머니의 돌봄 경험: Q 방법론적 접근(2017, 박사학위논문)</li>
                                                    </ul> */}
                                                    
                                                </div>
                                                
                                                
                                            </li>
                                        </ul>
                                        </div>
                                    </div>
                                </div>
                                )}
                                })}
                            </>}

                            {/*{menuCd == 9112 &&<>임의로
                            <ul className="faculty gaebyeol">
                               
                                <li className="faculty_box">
                                    <div className='img'><img src='/images/sub/content/general/general5/gen5_prof_3.png'/></div>   
                                    <div className='txt'>                                
                                        <div className="txt1">인성호 <span>학과장</span></div>
                                        <div className="txt2"><p className="h">학위</p><p>부동산학박사</p></div> 
                                        <div className="txt2 row2"><p className="h">연구분야</p><p>도시재생사업 및 개발, 지식산업센터, 리조트자산경영, 자산투자 </p></div> 
                                    </div>
                                    <div className='con'>
                                        <div className='txt'>
                                            <div className="phone"><span>연락처</span>055-250-1237 </div>
                                            <div className="room"><span>연구실</span>본관(1호관)  1603호실</div>
                                            <div className="more" onClick={()=>setMore(true)}><img src='/images/sub/content/p_icon3.png'/></div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            {more && 
                            <div className="faculty_more_back">
                                <div className="faculty_more">
                                    <img className='back' src="/images/sub/content/p_close.png" onClick={()=>setMore(false)}/>

                                    <div className='top'>
                                        <div className='col img'><img src='/images/sub/content/general/general5/gen5_prof_3.png'/></div>   
                                        <div className='col txt'>
                                            <div className="name">여형남 학과장</div>
                                             <div className="con">
                                                <div className="phone"><span>연락처</span>055-250-1237</div>
                                                <div className="room"><span>연구실</span>본관(1호관) 1603호실</div>
                                                <div className="email"><span>이메일</span>aaaa111@cs.ac.kr</div>
                                            </div> 
                                        </div>
                                    </div>
                                    <div className='profile_table_area'>
                                    <ul className='profile_table'>
                                        <li>
                                            <p>담당과목</p>
                                            <div>성인간호학Ⅰ,Ⅳ, 성인간호학실습Ⅱ,Ⅲ</div> 
                                        </li>
                                        <li>
                                            <p>학력</p>
                                            <div>이화여자대학교 간호학 석사, 아주대학교 간호학 박사</div>
                                        </li>
                                        <li>
                                            <p>연구분야</p>
                                            <div>간호관리, 간호윤리, 간호전문직</div>
                                        </li>
                                        <li>
                                            <p>주요경력</p>
                                            <div className='career'>
                                                <p>논문</p>
                                                <ul>
                                                    <li>외래 간호서비스 품질에 관한 연구(2011, 석사학위논문)</li>
                                                    <li>성조숙증 아동 어머니의 돌봄 경험: Q 방법론적 접근(2017, 박사학위논문)</li>
                                                    <li>성조숙증 아동 어머니의 돌봄 경험: Q 방법론적 접근(2017, 박사학위논문)</li>
                                                </ul>
                                                <p>수상</p>
                                                <ul>
                                                    <li>외래 간호서비스 품질에 관한 연구(2011, 석사학위논문)</li>
                                                    <li>성조숙증 아동 어머니의 돌봄 경험: Q 방법론적 접근(2017, 박사학위논문)</li>
                                                    <li>성조숙증 아동 어머니의 돌봄 경험: Q 방법론적 접근(2017, 박사학위논문)</li>
                                                </ul>
                                                <p>경력</p>
                                                <ul>
                                                    <li>외래 간호서비스 품질에 관한 연구(2011, 석사학위논문)</li>
                                                    <li>성조숙증 아동 어머니의 돌봄 경험: Q 방법론적 접근(2017, 박사학위논문)</li>
                                                    <li>성조숙증 아동 어머니의 돌봄 경험: Q 방법론적 접근(2017, 박사학위논문)</li>
                                                </ul>
                                            </div>
                                        </li>
                                    </ul>
                                    </div>
                                </div>
                            </div>}
                            </>}  */}

{/*(박사)부동산경영학과-교수진소개 
                            {menuCd ==9111 ?<>
                            <ul class="faculty">
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_1.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">인성호 학과장</div>
                                        <div class="txt2"><p class="h h2">학위</p><p>부동산학박사</p></div>  
                                        <div class="txt2"><p class="h h1">연락처</p><p>055-250-1237</p></div> 
                                        <div class="txt2"><p class="h h5">연구실</p><p>관광개발</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>도시재생사업 및 개발, 지식산업센터, 리조트자산경영, 자산투자</p></div>
                                        <div class="more"><span>more+</span></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">윤상환 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>상학박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>경영정보시스템(MIS)</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>전사적자원관리(ERP), 중소기업경영론, 창업실무세미나</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">성주한 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>부동산학박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>부동산관리</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>부동산시장분석, 부동산금융, 부동산계량분석</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">유기현 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>행정학박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>부동산마케팅</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>부동산금융투자, 부동산개발사례연구</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">윤부열 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>공학박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>부동산입지분석</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>지리정보체계(GIS)분석, 부동산정보분석</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">남중헌 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>경영학박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>관광경영</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>인적자원관리, 서비스마케팅, 소비자행동론, 회계원리</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">정상철 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>석좌교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>경제학박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>부동산경제</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>부동산시장, 부동산투자, 부동산정책</p></div>
                                    </div>
                                </li>
                                
                            </ul>
                            </>:null}*/}

                            {/*{menuCd ==9511 ?<>사회복지학과-교수진소개 
                            
                            <ul class="faculty">
                                
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">권순애 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>사회복지학 박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>사회복지행정</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>사회복지행정, 비영리조직, 프로그램 개발과 평가, 성과측정, 사회서비스 등</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이원준 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>사회복지학 박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>사회복지실천</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>사회복지실천, 가족복지, 가정과 가족관계 등</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">염동문 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>사회복지학 박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>사회복지실천</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>사회복지실천, 장애인복지, 사회복지실천 평가 및 연구방법론, 도구개발, 학대 등</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">백종규 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>사회복지학 박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>사회복지정책</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>사회복지정책, 빈곤과 불평등, 주거복지와 자산효과, 지역사회복지, 국제사회복지 등</p></div>
                                    </div>
                                </li>
                                
                            </ul>
                            </>:null}  */}    
                            
                            {/*{menuCd == 10411 ?<>글로벌비즈니스학과-교수진소개 
                            <div class='contents_none'>
                                <p class="title">자료 준비중입니다.</p>
                                <p>이용에 불편을 드려 죄송합니다.</p>
                                <p>더 많은 서비스와 정확한 정보를 전해드리기 위해 준비중입니다.</p>                            
                            </div>   
                            {/* <ul class="faculty">
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이길연</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>학과장</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>문학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>마케팅분야, 중국어교육, 한국어교육, 한중언어문화비교</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">윤상환</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>상학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>경영정보시스템(MIS),전사적자원관리(ERP),중소기업경영론, 창업실무세미나</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">인성호</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>호텔관광경영학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>관광산업개발, 호텔경영, 리조트입지분석, 소지자행동연구</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">위수광</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>문학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>교육과정 설계, 평가, 중국어교육, 사회언어연구</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이명애</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>문학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>중국문학, 중국어교육, 한국어교육, 상업회계</p></div>
                                    </div>
                                </li>     
                            </ul> 
                            </>:null} */} 
                           {/* {menuCd ==10811 ?<>간호학과-교수진소개 
                            <ul class="faculty">
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_1.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">제남주 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>학장</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>	여성간호학, 태전관리, 중년여성건강관리, 생명의료윤리, 웰다잉</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_2.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">방설영 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>학과장</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>간호관리학, 간호관리, 간호시뮬레이션, 간호윤리, 리더십, 환자안전</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_3.png'/></div> 
                                    <div class='col txt'>   
                                        <div class="txt1">여형남 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>학과장</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>성인·노인간호학, 건강증진, 질적연구, 노인전문간호사, 호스피스전문간호사</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">  
                                    <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_4.png'/></div>
                                    <div class='col txt'>   
                                        <div class="txt1">김미정 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>정신간호학, 정신재활, 정신과응급위기개입, 인지행동치료, 자살예방</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                     <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_5.png'/></div>
                                    <div class='col txt'>                                
                                        <div class="txt1">김순희 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>성인간호학 간호교육, 응급간호, 죽음태도, 재난간호, 응급전문간호사</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_6.png'/></div>  
                                    <div class='col txt'>                                
                                        <div class="txt1">김인숙 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>호스피스완화간호, 정신간호, 호스피스전문간호사</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_7.png'/></div> 

                                    <div class='col txt'>                                
                                        <div class="txt1">김지원 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사 / 보건학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>성인간호학, 지역사회보건, 건강증진</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_8.png'/></div>    
                                    <div class='col txt'>                                
                                        <div class="txt1">김혜진 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>여성건강간호학, 여성간호, 모성간호</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_9.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">박미라 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>모아간호학, 모유수유, 임산부교육, 신생아관리</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_10.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">박진희 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>기본간호학, 호스피스, 투약근접오류, 청소년 정신건강, Family nurse practitioner</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_11.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">방미성 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>성인간호학, 간호관리, 호스피스, 시뮬레이션</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_12.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">양현주 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>여성간호학, 모유수유, 건강증진, 의료 질 관리</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_13.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">오수미 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>보건행정학박사수료</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>호스피스완화의료, 지역사회보건, 외상후스트레스장애</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_14.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">윤채민 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>지역사회 보건간호학, 생애주기별 건강증진, 시뮬레이션, 재난간호</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이경숙 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사수료</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>성인간호학, 전담간호사</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_16.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이도영 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>기본간호학, 간호교육, 중재 간호, 스트레스, 통일 간호</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_17.png'/></div>     
                                    <div class='col txt'>                                
                                        <div class="txt1">임정혜 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>성인간호학, 성인간호, 간호교육, 감염관리</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_18.png'/></div>     
  
                                    <div class='col txt'>                                
                                        <div class="txt1">장선희 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>호스피스완화간호, 성인간호, 호스피스전문간호사, 생명윤리, 영성</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_19.png'/></div>     
   
                                    <div class='col txt'>                                
                                        <div class="txt1">정다인 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>기본간호학, 기본간호학실습, 성인간호, 감염관리, 근거기반, 체계적문헌고찰</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_20.png'/></div>     
                                    <div class='col txt'>                                
                                        <div class="txt1">최미향 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>아동간호학, 고위험 신생아 및 산모, 근거기반실무, 긍정심리, 간호전문직관</p></div>
                                    </div>
                                </li>
                            </ul>
                            </>:null}  */}
                            {/*{menuCd == 11211 ?<>미용예술학과-교수진소개 
                            <ul class="faculty">
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">오윤경 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>학과장</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>보건학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>피부미용, 피부과학, 미용보건, 화장품학, 아로마테라피</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">우미옥 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>이학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>메이크업, 뷰티아트, 색채학, 일러스트레이션</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">박선이 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>이학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>헤어미용, 미용장, 이용장, 두피관리학</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">홍다검 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>미용예술학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>네일아트미학, 살롱네일, 작품디자인</p></div>
                                    </div>
                                </li>
                                    
                            </ul>
                            </>:null}  */}  

                            {menuCd == 11611 ?<>{/*스마트융합공학부-교수진소개 */}
                            <ul class="faculty">
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이준식 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>학과장</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>공학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>항공우주기계공학 / 열유체</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이호영 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>공학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>전기공학 / 전기응용·전력기기·전기방전·자성재료 기술, 가상공학해석(CAE) 및 융·복합 시뮬레이션 기술</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">셀익잔 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>행정학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>소방행정 / 재난관리, 소방방재</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">남기훈 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>이학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>재난관리 / 재난안전</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이재학 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>공학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>기계공학 / 지능유체, 유공압제어</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이영동 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>공학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>임베디드시스템 / 유비쿼터스(Ubiquitous) IT</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">서형윤 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>공학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>컴퓨터공학 / 무선네트워크, 방송통신멀티미디어</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">백영미 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>공학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>컴퓨터공학 / 시스템모델링 및 성능분석, 사이버물리시스템, 자동차네트워크 및 무선네트워크, 정보보안</p></div>
                                    </div>
                                </li>
                                    
                            </ul>
                            </>:null}   
{/* ########################### 석사 */}
                            {menuCd ==12011 ?<>{/* 간호학과-교수진소개 */}
                            <ul class="faculty">
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/general/general5/gen5_prof_1.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">제남주 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>학장</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>	여성간호학, 태전관리, 중년여성건강관리, 생명의료윤리, 웰다잉</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">방설영 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>학과장</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>간호관리학, 간호관리, 간호시뮬레이션, 간호윤리, 리더십, 환자안전</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">여형남 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>학과장</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>성인·노인간호학, 건강증진, 질적연구, 노인전문간호사, 호스피스전문간호사</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">김미정 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>정신간호학, 정신재활, 정신과응급위기개입, 인지행동치료, 자살예방</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">김순희 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>성인간호학 간호교육, 응급간호, 죽음태도, 재난간호, 응급전문간호사</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">김인숙 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>호스피스완화간호, 정신간호, 호스피스전문간호사</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">김지원 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사 / 보건학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>성인간호학, 지역사회보건, 건강증진</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">김혜진 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>여성건강간호학, 여성간호, 모성간호</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">박미라 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>모아간호학, 모유수유, 임산부교육, 신생아관리</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">박진희 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>기본간호학, 호스피스, 투약근접오류, 청소년 정신건강, Family nurse practitioner</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">방미성 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>성인간호학, 간호관리, 호스피스, 시뮬레이션</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">양현주 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>여성간호학, 모유수유, 건강증진, 의료 질 관리</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">오수미 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>보건행정학박사수료</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>호스피스완화의료, 지역사회보건, 외상후스트레스장애</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">윤채민 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>지역사회 보건간호학, 생애주기별 건강증진, 시뮬레이션, 재난간호</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이경숙 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사수료</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>성인간호학, 전담간호사</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이도영 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>기본간호학, 간호교육, 중재 간호, 스트레스, 통일 간호</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">임정혜 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>성인간호학, 성인간호, 간호교육, 감염관리</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">장선희 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>호스피스완화간호, 성인간호, 호스피스전문간호사, 생명윤리, 영성</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">정다인 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>기본간호학, 기본간호학실습, 성인간호, 감염관리, 근거기반, 체계적문헌고찰</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">최미향 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>간호학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>아동간호학, 고위험 신생아 및 산모, 근거기반실무, 긍정심리, 간호전문직관</p></div>
                                    </div>
                                </li>
                            </ul>
                            </>:null}
                            {menuCd == 12411 ?<>{/*스마트융합공학부-교수진소개 */}
                            <ul class="faculty">
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이준식 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>학과장</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>공학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>항공우주기계공학 / 열유체</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이호영 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>공학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>전기공학 / 전기응용·전력기기·전기방전·자성재료 기술, 가상공학해석(CAE) 및 융·복합 시뮬레이션 기술</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">셀익잔 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>행정학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>소방행정 / 재난관리, 소방방재</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">남기훈 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>이학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>재난관리 / 재난안전</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이재학 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>공학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>기계공학 / 지능유체, 유공압제어</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이영동 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>공학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>임베디드시스템 / 유비쿼터스(Ubiquitous) IT</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">서형윤 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>공학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>컴퓨터공학 / 무선네트워크, 방송통신멀티미디어</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">백영미 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>공학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>컴퓨터공학 / 시스템모델링 및 성능분석, 사이버물리시스템, 자동차네트워크 및 무선네트워크, 정보보안</p></div>
                                    </div>
                                </li>
                                    
                            </ul>
                            </>:null}   
                            {menuCd == 12811 ?<>{/*글로벌비즈니스학과-교수진소개 */}
                            <ul class="faculty">
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이길연 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>학과장</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>문학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>마케팅분야, 중국어교육, 한국어교육, 한중언어문화비교</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">윤상환 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>상학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>경영정보시스템(MIS),전사적자원관리(ERP),중소기업경영론, 창업실무세미나</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">인성호 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>호텔관광경영학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>관광산업개발, 호텔경영, 리조트입지분석, 소지자행동연구</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">위수광 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>문학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>교육과정 설계, 평가, 중국어교육, 사회언어연구</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이명애 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>문학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>중국문학, 중국어교육, 한국어교육, 상업회계</p></div>
                                    </div>
                                </li>     
                            </ul>
                            </>:null} 

                            {menuCd ==13211 ?<>{/*특수-사회복지학과-교수진소개 */}
                            <ul class="faculty">
                                
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">권순애 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>학과장</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>사회복지학 박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>사회복지행정</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>사회복지행정, 비영리조직, 프로그램 개발과 평가, 성과측정, 사회서비스 등</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이진향 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>사회복지학 박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>사회복지실천</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>사회복지실천, 정신보건 등</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이원준 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>사회복지학 박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>사회복지실천</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>사회복지실천, 가족복지, 가정과 가족관계 등</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">염동문 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>사회복지학 박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>사회복지실천</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>사회복지실천, 장애인복지, 사회복지실천 평가 및 연구방법론, 도구개발, 학대 등</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">백종규 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>사회복지학 박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>사회복지정책</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>사회복지정책, 빈곤과 불평등, 주거복지와 자산효과, 지역사회복지, 국제사회복지 등</p></div>
                                    </div>
                                </li>
                                
                            </ul>
                            </>:null}
                            {menuCd ==13611 ?<>{/*특수-미용예술학과-교수진소개 */}
                            <ul class="faculty">
                                
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">오윤경 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>학과장</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>보건학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>피부미용, 피부과학, 화장품학, 아로마테라피</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">박선이 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>이학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>헤어미용, 미용장, 이용장, 두피케어</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">우미옥 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>이학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>메이크업, 뷰티아트, 색채학, 일러스트레이션</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">홍다검 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>미용예술학박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>네일아트미학, 살롱네일, 작품디자인</p></div>
                                    </div>
                                </li>
                            </ul>
                            </>:null}   
                            {menuCd ==14011 ?<>{/*특수-음악학과-교수진소개 */}
                            <ul class="faculty">
                                
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">류정용 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>학과장</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>예술학석사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>연주전공 / 드럼</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">윤민선 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>최고연주자 과정</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>피아노 / 피아노실기</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">김의진 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>음악학 박사 수료</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>음악이론, 연주 및 논문지도</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이지선 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>음악학 박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>피아노 / 피아노 실기</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">최준 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>예술학석사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>	보컬&작곡 / 보컬&작곡</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">특임교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>전문분야 다수</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>전공 · 이론지도, 논문지도</p></div>
                                    </div>
                                </li>                                
                            </ul>
                            </>:null} 
                            {menuCd ==14411 ?<>{/*특수-유아교육과-교수진소개 */}
                            <ul class="faculty">
                                
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">안영혜 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>학과장</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>교육학 박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>유아교육전공</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>유아교육과정 및 부모교육</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">안부금 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>교육학 박사</p></div>
                                        <div class="txt2"><p class="h h3">전공</p><p>유아교육전공</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>유아교수학습방법, 유아교육과정</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">김혜윤 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>교육학 박사</p></div>
                                        <div class="txt2"><p class="h h3">전공</p><p>유아교육전공</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>아동문학, 교사교육</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">한현정 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>철학 박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>기초교육학전공</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>비교유아교육, 교육철학</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">이하정 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>교육학 박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>교육시스템전공</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>생태유아교육, 유아놀이</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">장미연 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>교육학 박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>유아교육전공</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>생태유아교육, 영유아발달</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">김영은 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>문학 박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>유아교육, 인성교육 전공</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>유아교육/인성교육</p></div>
                                    </div>
                                </li>                                
                            </ul>
                            </>:null}
                            {menuCd ==14811 ?<>{/*특수-식품영양학과-교수진소개 */}
                            <ul class="faculty">                                
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">서보영 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>학과장</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>이학 박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>단체급식, 급식경영, 메뉴개발</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">박혜진 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>이학 박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>식품위생, 식품관능평가, 식품생리활성</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">허은실 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>                                        
                                        <div class="txt2"><p class="h h2">학위</p><p>이학 박사</p></div> 
                                        <div class="txt2"><p class="h h3">전공</p><p>유아교육전공</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>식사요법, 영양생리, 식품영양통계</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">정은정 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>이학 박사</p></div> 
                                        <div class="txt2"><p class="h h3">연구분야</p><p>식품미생물, 식품가공, 식품발효, 식품위생</p></div>
                                    </div>
                                </li>
                            </ul>
                            </>:null}
                            {menuCd ==15211 ?<>{/*특수-부동산경영대학원_부동산학과-교수진소개 */}
                            <ul class="faculty">                                
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">성주한 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>주임교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>부동산학박사</p></div>
                                        <div class="txt2"><p class="h h3">전공</p><p>부동산관리</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>부동산시장분석, 부동산금융, 부동산계량분석</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">윤상환 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>상학박사</p></div>
                                        <div class="txt2"><p class="h h3">전공</p><p>경영정보시스템(MIS)</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>전사적자원관리(ERP), 중소기업경영론, 창업실무세미나</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">유기현 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>행정학박사</p></div>
                                        <div class="txt2"><p class="h h3">전공</p><p>부동산마케팅</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>부동산금융투자, 부동산개발사례연구</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">윤부열 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>공학박사</p></div>
                                        <div class="txt2"><p class="h h3">전공</p><p>부동산입지분석</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>지리정보체계(GIS)분석, 부동산정보분석</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">인성호 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>호텔관광경영학박사</p></div>
                                        <div class="txt2"><p class="h h3">전공</p><p>관광산업개발</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>관광지(도시재생지)개발 / 지식산업센터 자산운영관리/ 관광리조트 경영관리</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">남중헌 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>경영학박사</p></div>
                                        <div class="txt2"><p class="h h3">전공</p><p>관광경영</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>인적자원관리, 서비스마케팅, 소비자행동론, 회계원리</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">정상철 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>석좌박사</p></div>
                                        <div class="txt2"><p class="h h3">전공</p><p>부동산경제</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>부동산시장, 부동산투자, 부동산정책</p></div>
                                    </div>
                                </li>
                            </ul>
                            </>:null}

                            {menuCd ==15611 ?<>{/*특수-부동산경영대학원_부동산학과-교수진소개 */}
                            <ul class="faculty">     
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">인성호 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>주임교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>호텔관광경영학박사</p></div>
                                        <div class="txt2"><p class="h h3">전공</p><p>관광산업개발</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>관광지(도시재생지)개발 / 지식산업센터 자산운영관리/ 관광리조트 경영관리</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">정삼석 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>도시계획학박사</p></div>
                                        <div class="txt2"><p class="h h3">전공</p><p>부동산공법</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>국토도시계획, 도시개발정책, 재개발·재건축론</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">윤상환 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>상학박사</p></div>
                                        <div class="txt2"><p class="h h3">전공</p><p>경영정보시스템(MIS)</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>전사적자원관리(ERP), 중소기업경영론, 창업실무세미나</p></div>
                                    </div>
                                </li>                           
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">성주한 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>부동산학박사</p></div>
                                        <div class="txt2"><p class="h h3">전공</p><p>부동산관리</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>부동산시장분석, 부동산금융, 부동산계량분석</p></div>
                                    </div>
                                </li>
                                
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">유기현 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>행정학박사</p></div>
                                        <div class="txt2"><p class="h h3">전공</p><p>부동산마케팅</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>부동산금융투자, 부동산개발사례연구</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">윤부열 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>공학박사</p></div>
                                        <div class="txt2"><p class="h h3">전공</p><p>부동산입지분석</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>지리정보체계(GIS)분석, 부동산정보분석</p></div>
                                    </div>
                                </li>
                                <li class="faculty_box">
                                    <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                    <div class='col txt'>                                
                                        <div class="txt1">정상철 교수</div>
                                        <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                        <div class="txt2"><p class="h h2">학위</p><p>석좌박사</p></div>
                                        <div class="txt2"><p class="h h3">전공</p><p>부동산경제</p></div>
                                        <div class="txt2"><p class="h h3">연구분야</p><p>부동산시장, 부동산투자, 부동산정책</p></div>
                                    </div>
                                </li>
                            </ul>
                            </>:null}

                            {menuCd ==16011 ?<>{/*특수-부동산경영대학원_최고경영자 과정-교수진소개 */}
                            <div class="li_title">
                                <p class="title mgB_30">전임교수진 소개</p>                            
                                <ul class="faculty mgB_80">     
                                    <li class="faculty_box">
                                        <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                        <div class='col txt'>                                
                                            <div class="txt1">정상철 교수</div>
                                            <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                            <div class="txt2"><p class="h h2">학위</p><p>경제학박사</p></div>
                                            <div class="txt2"><p class="h h3">연구분야</p><p>부동산경제,부동산시장,부동산투자,부동산정책</p></div>
                                        </div>
                                    </li>
                                    <li class="faculty_box">
                                        <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                        <div class='col txt'>                                
                                            <div class="txt1">정삼석 교수</div>
                                            <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                            <div class="txt2"><p class="h h2">학위</p><p>도시계획학박사</p></div>
                                            <div class="txt2"><p class="h h3">연구분야</p><p>국토도시계획, 도시개발정책, 재개발·재건축론</p></div>
                                        </div>
                                    </li>                          
                                    <li class="faculty_box">
                                        <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                        <div class='col txt'>                                
                                            <div class="txt1">성주한 교수</div>
                                            <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                            <div class="txt2"><p class="h h2">학위</p><p>부동산학박사</p></div>
                                            <div class="txt2"><p class="h h3">연구분야</p><p>부동산시장분석, 부동산금융, 부동산계량분석</p></div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_30">겸임교수진 소개</p>
                                <ul class="faculty">     
                                    <li class="faculty_box">
                                        <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                        <div class='col txt'>                                
                                            <div class="txt1">이성수 교수</div>
                                            <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                            <div class="txt2"><p class="h h3">전공</p><p>부동산경매 및 투자분석</p></div>
                                            <div class="txt2"><p class="h h4">비고</p><p>법무사</p></div>
                                        </div>
                                    </li>
                                    <li class="faculty_box">
                                        <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                        <div class='col txt'>                                
                                            <div class="txt1">이경희 교수</div>
                                            <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                            <div class="txt2"><p class="h h3">전공</p><p>감정평가이해와 실무</p></div>
                                            <div class="txt2"><p class="h h4">비고</p><p>감정평가사</p></div>
                                        </div>
                                    </li>
                                    <li class="faculty_box">
                                        <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                        <div class='col txt'>                                
                                            <div class="txt1">석창목 교수</div>
                                            <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                            <div class="txt2"><p class="h h3">전공</p><p>부동산사법 및 민사특별법</p></div>
                                            <div class="txt2"><p class="h h4">비고</p><p>변호사</p></div>
                                        </div>
                                    </li>
                                    <li class="faculty_box">
                                        <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                        <div class='col txt'>                                
                                            <div class="txt1">조윤재 교수</div>
                                            <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                            <div class="txt2"><p class="h h3">전공</p><p>부동산개발 및 자산운용컨설팅</p></div>
                                            <div class="txt2"><p class="h h4">비고</p><p>경영지도사</p></div>
                                        </div>
                                    </li>
                                    <li class="faculty_box">
                                        <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                        <div class='col txt'>                                
                                            <div class="txt1">이진백 교수</div>
                                            <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                            <div class="txt2"><p class="h h3">전공</p><p>토지보상평가실무</p></div>
                                            <div class="txt2"><p class="h h4">비고</p><p>감정평가사</p></div>
                                        </div>
                                    </li>
                                    <li class="faculty_box">
                                        <div class='col img'><img src='/images/sub/content/faculty.png'/></div>   
                                        <div class='col txt'>                                
                                            <div class="txt1">김주범 교수</div>
                                            <div class="txt2"><p class="h h1">직위</p><p>교수</p></div>  
                                            <div class="txt2"><p class="h h3">전공</p><p>부동산물권법</p></div>
                                            <div class="txt2"><p class="h h4">비고</p><p>대표</p></div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            </>:null}
                           

                        </div>
                        
                    </div>
                </div>

            </div>
        </>
        
    )
}

export default Profile;