import React, { useState, useEffect, useRef  } from 'react';
import {  Link, useParams, useLocation ,useNavigate  } from 'react-router-dom';
import { SERVER_URL } from "context/config";
import SubBannerComp from 'pages/common/components/subBannerComp';
import SubMenuComp from 'pages/sub/content/common/subMenuComp';
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
            
            const res = await fetch(SERVER_URL+"/api/contents/"+menuCd+"/view",{method:"GET", headers:{'content-type':'application/json'}});
            const data = await res.json();  
            setContentList(data.getContentsView);
            
        }catch(e){
            console.log(e);
        }
    }
    function menu(menuCd) {
        let i
        for(i=0; i < menuList.length; i++){
            if(menuCd == menuList[i].MENU_CD){
                if(menuList[i].DEPTH == 4){
                    // dep4_MC = menuCd
                    dep3_MC = menuList[i].PARENT_MENU_CD //dep4면 부모dep3 메뉴코드 저장
                    menu(menuList[i].PARENT_MENU_CD)
                }
                if(menuList[i].DEPTH == 3){
                    //dep4면 부모dep3 메뉴코드 저장
                    return dep3_NM = menuList[i].MENU_NM 
                }
                return  //현 메뉴코드의 부모메뉴코드 넣고 다시
            }
        }    
    }
        
    return(
        <>
            <SubBannerComp menuCd={menuCd}/>
            <div className='subcontain'>
                {/* <SideMenuComp menuCd={menuCd}/>                 */}
                <div className='infocontain'>
                    {/* <PathbarComp menuCd={menuCd}/> */}
                    <div className='contents_area'>
                        <div className='contentBox'>
                            <SubMenuComp />                          

                            <div dangerouslySetInnerHTML={{ __html:  contentList[0]?.CONTENT }} ref={containerRef}></div> 
                            {contentList.length == 0 && menuCd != 182 &&<>
                                <div class='contents_none'>
                                    <img src="/images/sub/content/contents_none.png"/>
                                    <p class="title">자료를 준비하고 있습니다.</p>
                                    <p>더 많은 서비스와 정확한 정보를 전해드리기 위해 준비중입니다.</p>
                                    <p>이용에 불편을 드려 죄송합니다.</p>                            
                                    </div>   
                            </>}
                            {/*인사말  
                            {menuCd ==65 ?<>
                            <div class="t_head">                            
                                <div class="t_head_box">
                                    <p>" 사회가 필요로하는 전문인력 양성 "</p>
                                    <div class='img'><img src='/images/sub/content/intro1_wonjang.jpg'/></div>  
                                    <p class="nm">염 동 문 <span>대학원장</span></p>
                                </div> 
                            </div>
                            <div class="t_head_txt">  
                                <div class="txt">
                                    <p>존경하는 창신대학교 대학원 가족 및 홈페이지 방문자 여러분, 안녕하십니까?</p>
                                    <p class="mgB_30">이번에 새롭게 창신대학교 대학원장으로 취임하게 된 염동문입니다.</p>
                                    <p class="mgB_30">우리 창신대학교 대학원은 급변하는 시대적 요구에 발맞추어, 이론과 실무가 조화된 교육을 통해 미래 사회를 이끌어갈 전문 인재를 양성하고자 끊임없이 노력하고 있습니다. 이를 위하여 글로벌 역량을 갖춘 교수진과 함께 심층적인 연구 및 학술 교류를 활성화하고, 다양하고 혁신적인 교육 프로그램을 마련해 학문적 시야를 넓히고 있습니다.</p>
                                    <p class="mgB_30">앞으로도 저를 비롯한 우리 대학원 구성원은 창신대학교의 교육 이념과 비전을 토대로, 융복합적 사고와 창의력을 갖춘 리더를 배출하기 위한 학술·연구 환경을 더욱 발전시키겠습니다. 또한, 지역사회 및 산업 현장과의 긴밀한 협업을 통해 실질적인 가치를 창출하고, 미래 사회의 변화를 주도할 수 있는 연구 결과와 전문 지식을 지속적으로 선보일 수 있도록 최선을 다하겠습니다.</p>
                                    <p class="mgB_30">창신대학교 대학원 홈페이지를 통해 저희가 걸어가는 길과 다양한 교육·연구 활동을 확인하시고, 언제든지 소중한 의견과 성원을 보내주시면 감사하겠습니다. 여러분의 관심과 참여가 우리 대학원 발전에 큰 힘이 됩니다.</p>
                                    <p class="mgB_30">감사합니다.</p>
                                </div>
                                <p class="title txt_R mgR_40 font_w_600">창신대학교 대학원장 염동문 드림</p>
                            </div> 
                            </>:null}*/}

                            {/*구성원소개 
                            {menuCd ==67 ?<>
                            <div class="li_title">
                            <p class="title mgB_24">구성원 소개</p>
                            <div class="is-wauto-box mgB_80" >  
                                <table class="content_table">
                                <colgroup>
                                    <col width="18%"></col>
                                    <col width="13%"></col>
                                    <col width="13%"></col>
                                    <col width="auto"></col>
                                    <col width="18%"></col>
                                </colgroup>
                                <thead>
                                    <tr>
                                    <th>구분</th>
                                    <th>이룸</th>
                                    <th>직책</th>
                                    <th>담당업무</th>
                                    <th> 전화</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>대학원</td>
                                        <td>염동문</td>
                                        <td>대학원장</td>
                                        <td>대학원 운영 총괄</td>
                                        <td>055-250-3150</td>
                                    </tr>
                                    <tr>
                                        <td rowspan="4">대학원행정지원팀</td>
                                        <td>이준호</td>
                                        <td>팀장</td>
                                        <td>대학원 행정지원팀 업무 총괄</td>
                                        <td>055-250-3152</td>
                                    </tr>
                                    <tr>
                                        <td>김소민</td>
                                        <td>직원</td>
                                        <td>대학원 학사담당(학적, 수업, 입시, 통계)</td>
                                        <td>055-250-3153</td>
                                    </tr>
                                    <tr>
                                        <td>강보정</td>
                                        <td>행정조교</td>
                                        <td>대학원 학사업무지원(등록, 장학, 논문, 학적)</td>
                                        <td>055-250-3159</td>
                                    </tr>
                                    <tr>
                                        <td>심연진</td>
                                        <td>행정조교</td>
                                        <td>대학원 학과 행정</td>
                                        <td>055-250-3151</td>
                                    </tr>
                                    <tr>
                                        <td>최고경영자과정</td>
                                        <td>조정희</td>
                                        <td>직원</td>
                                        <td>AMP 담당</td>
                                        <td>055-250-3155</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <ul class="contactInfo info2">
                                <li class="email"><span>이메일</span> csgrad@cs.ac.kr</li>
                                {/* <li class="phone"><span>전화</span> 250 - 3152~3,9 </li> 
                                <li class="fax"><span>팩스</span> 055-250-3154</li>
                            </ul>
                            </div>
                            </>:null}*/} 

                            {/*찾아오시는 길 
                            {menuCd ==66 ?<>
                            <div class="li_title">
                                <p class="title mgB_18">약도</p>
                                <div class="mgB_80">
                                    <div className='kkmap_area'>
                                    <Map className='kkmap' center={{ lat:35.2433734, lng: 128.5999999999}}>
                                            <MapMarker className='kkmapMarker' position={{ lat: 35.2434632, lng: 128.6015862}}>
                                            <div className='kkmapMarkerN'>창신대학교 도서관(9호관)</div>   
                                            </MapMarker>                                                           
                                        </Map>                      
                                    </div>
                                </div>
                            </div>   
                            <div class="li_title">
                                <p class="title mgB_24">승용차이용시</p>
                                <p class="li mgB_8 txtst">서울, 대전에서 오시는 경우</p>
                                <p class=" mgL_40 mgB_30">서울(대전) → 경부고속도로 → 대진고속도로 → 남해고속도로 → 동마산 I/C → 창신대학교</p>
                                <p class="li mgB_8 txtst">대구에서 오시는 경우</p>
                                <p class=" mgL_40 mgB_30">대구 → 중부내륙고속도로 → 칠원분기점 → 남해고속도로 → 동마산 I/C → 창신대학교</p>
                                <p class="li mgB_8 txtst">부산에서 오시는 경우</p>
                                <p class=" mgL_40 mgB_8">북부산 → 진례분기점 → 동마산 I/C → 창신대학교</p>
                                <p class=" mgL_40 mgB_80">서부산 → 장유 I/C → 진례분기점 → 창신대학교</p>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_30 ">고속버스이용시</p>
                                <div class="is-wauto-box mgB_12 wid_95">  
                                    <table class="content_table of_n">
                                    <colgroup>
                                        <col width="15%"></col>
                                        <col width="15%"></col>
                                        <col width="15%"></col>
                                        <col width="auto"></col>
                                    </colgroup>
                                    <thead>
                                        <tr>
                                        <th>출발지</th>
                                        <th>도착지</th>
                                        <th>소요시간</th>
                                        <th>운행회사</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>서울</th>
                                            <td rowspan="2">창원</td>
                                            <td rowspan="2">4:10</td>
                                            <td rowspan="2">동양고속, 중앙고속</td>
                                        </tr>
                                        <tr>
                                            <th class="borR">동서울</th>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div>                                
                                <p class="li_s mgL_40 mgB_12">서울종합버스터미널 : http://www.exterminal.co.kr / T. 1688-4700</p>
                                <p class="li_s mgL_40 mgB_12">경부고속도로-비룡JC-대전통영간고속도로-진주JC-남해고속도로-창원-창신대학교</p>
                                <p class="li_s mgL_40 mgB_12">사상시외버스터미널(서부시외버스터미널) → 남해고속도로 → 마산합성시외버스터미널 → 창신대학교</p>
                                <p class="li_s mgL_40 mgB_12">동래시외버스정류장 → 남해고속도로 → 마산합성시외버스터미널 → 창신대학교</p>
                                <p class="li_s mgL_40 mgB_30">노포동시외버스터미널(동부시외버스터미널) → 남해고속도로 → 마산합성시외버스터미널 → 창신대학교</p>
                                <div class="is-wauto-box mgB_12 wid_95">  
                                    <table class="content_table of_n">
                                    <colgroup>
                                        <col width="15%"></col>
                                        <col width="15%"></col>
                                        <col width="15%"></col>
                                        <col width="auto"></col>
                                    </colgroup>
                                    <thead>
                                        <tr>
                                        <th>출발지</th>
                                        <th>도착지</th>
                                        <th>소요시간</th>
                                        <th>운행회사</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>부산사상</th>
                                            <td rowspan="3">창원, 마산</td>
                                            <td>1:00</td>
                                            <td>천일여객, 고려객.신흥여객</td>
                                        </tr>
                                        <tr>
                                            <th>해운대(동래)</th>
                                            <td>1:30</td>
                                            <td>현대고속</td>
                                        </tr>
                                        <tr>
                                            <th>노포동</th>
                                            <td>1:30</td>
                                            <td>경원여객, 신흥여객.현대고속</td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div>
                                <p class="li_s mgL_40 mgB_12">동래시외버스정류장 → 남해고속도로 → 마산합성시외버스터미널 → 창신대학교</p>
                                <p class="li_s mgL_40 mgB_80">노포동시외버스터미널(동부시외버스터미널) → 남해고속도로 → 마산합성시외버스터미널 → 창신대학교</p>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_30">KTX 이용시</p>
                                <div class="is-wauto-box mgB_12 wid_95">  
                                    <table class="content_table of_n">
                                    <colgroup>
                                        <col width="20%"></col>
                                        <col width="20%"></col>
                                        <col width="auto"></col>
                                        <col width="20%"></col>
                                    </colgroup>
                                    <thead>
                                        <tr>
                                        <th>구간</th>
                                        <th>소요시간</th>
                                        <th>횟수</th>
                                        <th>첫차</th>
                                        <th>막차</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>서울 → 마산역</th>
                                            <td>2시간 50분</td>
                                            <td>평일 6회,주말 10회</td>
                                            <td>6:10</td>
                                            <td>21:50</td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div>  
                                <p class="li_s mgL_40 mgB_12">한국철도공사 : http://www.korail.com/ / T. 1544-7788/1588-7788</p>
                                <p class="li_s mgL_40 mgB_80">서울역 → 마산역 → 창신대학교</p>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_30">항공 이용시</p>
                                <p class="li mgB_8">김해공항(리무진버스 이용)</p>
                                <p class=" mgL_40 mgB_12">창원 리무진 버스 이용 → 남해고속도로 → 창원터널 → 창원병원 → 창원고속(시외) 버스터미널(하차)→ 마산역(하차) → 창신대학교</p>
                            </div>
                            </>:null}*/}

                            {/*장학제도
                            {menuCd == 164 ?<>
                            <div class="li_title">
                                <p class="title mgB_30">장학제도 안내</p> 
                                <div class="notitxt2 mgB_30"><p class="mgB_4 txt">아래 장학제도 외 특별장학금, 교외장학금이 있으며, 관련사항은 대학원위원회의 심의·의결을 거쳐 졀정되며 세부 운영 사항은 규정에 따라 조정될 수 있습니다.</p></div>
                                <div class="is-wauto-box mgB_18">
                                    <table class="content_table">
                                    <colgroup>
                                        <col width ="25%"></col>
                                        <col width ="auto"></col>
                                        <col width ="25%"></col>
                                    </colgroup>
                                    <thead>
                                        <tr>
                                        <th>장 학 금</th>
                                        <th>대 상</th>
                                        <th>내  용</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>면학장려장학금</td>
                                            <td class='txt_L'>신입생 및 재학생</td>
                                            <td>등록금의 50% 감면</td>
                                        </tr>
                                        <tr>
                                            <td>교직원장학금</td>
                                            <td class='txt_L'>본교 교직원</td>
                                            <td>등록금의 70% 감면</td>
                                        </tr>
                                        <tr>
                                            <td>리더십장학금</td>
                                            <td class='txt_L'>학기별로 선발된 학과별 학생대표 (학과장 추천)</td>
                                            <td> 일정액 지급</td>
                                        </tr>
                                        <tr>
                                            <td>가족장학금</td>
                                            <td class='txt_L'>본교에 가족이 2명 이상 재학 중인 경우, 대학원생 1인에게 지급</td>
                                            <td>등록금의 10% 지급</td>
                                        </tr>
                                        </tbody>                                    
                                    </table>
                                </div>
                            </div>
                            </>:null}*/} 

                            {/*논문제출자격
                            {menuCd == 169 ?<>
                                <div class="li_title">
                                    <p class="title mgB_30">학위청구논문 제출자격</p>
                                    <div class="ol_li mgL_20">
                                        <div class="num">01</div>
                                        <div class="txt">
                                            <div>학위과정별 수료학점을 취득한 자 또는 취득예정자</div>
                                        </div>
                                    </div>
                                    <div class="ol_li mgL_20">
                                        <div class="num">02</div>
                                        <div class="txt">
                                            <div>학업성적 총 평균평점이 B(3.0) 이상인 자</div>
                                        </div>
                                    </div>
                                    <div class="ol_li mgL_20">
                                        <div class="num">03</div>
                                        <div class="txt">
                                            <div>논문연구학점을 이수한 자</div>
                                        </div>
                                    </div>
                                    <div class="ol_li mgL_20">
                                        <div class="num">04</div>
                                        <div class="txt">
                                            <div>자격시험에 합격한 자</div>
                                        </div>
                                    </div>
                                    <div class="ol_li mgL_20">
                                        <div class="num">05</div>
                                        <div class="txt">
                                            <div>논문심사에 합격한 자</div>
                                        </div>
                                    </div>
                                </div>
                            </>:null}*/}

                            {/*학위논문 신청/심사
                            {menuCd == 170 ?<>                            
                            <div class="li_title">
                                <p class="title mgB_40">학위청구논문 신청/심사</p>                                    
                                <p class="li mgB_12">논문심사 신청</p>
                                <p class="li_s mgL_40 mgB_12">학위청구논문을 심사받고자 하는 자는 논문 신청 후 소정의 심사료(석사 120,000원)를 납부하고, 심사신청 논문 3부를 작성하여 제출</p>
                                <p class="li_s mgL_40 mgB_40">신청방법: 논문심사신청(학생) → 심사신청 논문 제출(학생) → 지도교수 및 심사위원에게 배부(대학원) → 심사진행</p>    
                                <p class="li mgB_12">학위청구논문 심사</p>
                                <p class="li_s mgL_40 mgB_12">석사과정: 2회 실시</p>    
                                <p class="li_s mgL_40 mgB_40">2회: 구두심사(심사위원 3인 + 학생)</p>    
                                <p class="li mgB_12">논문제목변경신청</p>
                                <p class="li_s mgL_40 mgB_12">『논문제목 변경 신청서』작성 → 대학원 행정지원팀 제출</p>    
                                <p class="li_s mgL_40 mgB_40">학생 본인이 논문심사 기간 중 변경 가능</p>  
                                <p class="mgL_20 mgB_24 txtst">※ 자세한 내용은 대학원 공지사항을 참고하시기 바랍니다.</p>                       
                            </div>
                            </>:null}*/}

                            {/*외국어시험 및 종합시험
                            {menuCd == 171 ?<>
                            <div class="li_title">
                                <p class="title mgB_40">학위청구논문제출 자격시험</p>                                    
                                <p class="li mgB_18">외국어시험</p>
                                <p class="li_s mgL_40 mgB_12">응시자격: 2회 이상의 정규 등록을 필한 자</p>
                                <p class="li_s mgL_40 mgB_12">시험시기: 매학기 시행(학사일정 및 대학원 공지사항 참고)</p>
                                <p class="li_s mgL_40 mgB_12">시험과목: 영어, 일본어, 중국어 중 택 1과목(외국인학생의 경우 한국어시험으로 대체)</p> 
                                <p class="li_s mgL_40 mgB_12">신청방법: 『외국어시험 원서』작성 → 대학원 행정지원팀으로 원서 및 응시료 제출</p>  
                                <p class="li_s mgL_40 mgB_12">합격기준: 100점 만점으로 하며 60점 이상 취득한 자</p>  
                                <p class="li_s mgL_40 mgB_30">외국어시험 면제: 시험제출 기간내 해당 면제 내용 증빙서류를 제출하여야 면제 받음.</p> 
                                <p class="mgL_20 mgB_12 txtst">※ 외국어 시험일 기준 최근 2년 이내에 공인기관에서 취득한 외국어 성적 중 다음 기준에 해당하는 자</p>                       
                                <div class="is-wauto-box wid_95 mgB_60">  
                                    <table class="content_table">
                                        <colgroup>                                            
                                            <col width="20%"></col>
                                            <col width="44%"></col>
                                            <col width="36%"></col>
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>구분</th>
                                                <th>내국인</th>
                                                <th>외국인</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>영어</td>
                                                <td class="txt_L">
                                                    <span class="font_w_500 mgL_20">TOEFL</span>
                                                    <ul class="mgL_40 ul_li_style">                                                
                                                        <li>PBT 535점 이상</li>
                                                        <li>CBT 207점 이상</li>
                                                        <li>IBT 76점 이상</li>
                                                    </ul>
                                                    <p><span class="font_w_500 mgL_20">TOEIC</span> 
                                                        <ul class="mgL_20 ul_li_style mgL_40">                                                
                                                            <li>650점 이상</li>
                                                        </ul>
                                                    </p>
                                                    <p><span class="font_w_500 mgL_20">TEPS</span>
                                                        <ul class="mgL_20 ul_li_style mgL_40">                                                
                                                            <li>540점 이상</li>
                                                        </ul> 
                                                    </p>
                                                    <p><span class="font_w_500 mgL_20">IELTS</span>
                                                        <ul class="mgL_20 ul_li_style mgL_40">                                                
                                                            <li> 5.5점 이상</li>
                                                        </ul>
                                                    </p>
                                                </td>
                                                <td class="txt_L">
                                                    <span class="font_w_500 mgL_20">TOPIK</span> (한국교육과정평가원 주관)
                                                    <ul class="mgL_20 ul_li_style mgL_40">                                                
                                                        <li>4급 이상</li>
                                                    </ul>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>일본어</td>
                                                <td class="txt_L">
                                                    <p><span class="font_w_500 mgL_20">JPT</span>(국제교류진흥외 주관) 
                                                        <ul class="mgL_20 ul_li_style mgL_40">                                                
                                                            <li>650점 이상</li>
                                                        </ul> 
                                                    </p>
                                                    <p><span class="font_w_500 mgL_20">JLPT</span>(국제교류기금 주관)
                                                        <ul class="mgL_20 ul_li_style mgL_40">                                                
                                                            <li>2급 이상</li>
                                                        </ul> 
                                                    </p>                                                   
                                                </td>
                                                <td> </td>
                                            </tr>
                                            <tr>
                                                <td>중국어</td>
                                                <td class="txt_L">
                                                    <span class="font_w_500 mgL_20">HSK</span>(중국교육부 국가한어수평고시위원회 주관)
                                                    <ul class="mgL_20 ul_li_style mgL_40">                                                
                                                        <li>4급 이상</li>
                                                    </ul>                                                                                                    
                                                </td>
                                                <td> </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p class="li mgB_18">전공종합시험</p>
                                <p class="li_s mgL_40 mgB_12">응시자격: 3회 이상의 정규 등록을 필한 자로서 12학점 이상을 취득하고 외국어시험에 합격한 자</p>
                                <p class="li_s mgL_40 mgB_12">시험과목: 석사 전공 2과목 이상</p>
                                <p class="li_s mgL_40 mgB_12">시험시기: 매학기 시행(학사일정 및 대학원 공지사항 참고)</p>
                                <p class="li_s mgL_40 mgB_12">신청방법: 『전공종합시험 원서』작성 → 대학원 행정지원팀으로 원서 및 응시료 제출</p>    
                                <p class="li_s mgL_40 mgB_40">합격기준: 100점 만점으로 하며 70점 이상 취득한 자</p>    
                                                    
                            </div>
                            </>:null}*/}

                            {/*수료후 연구생 등록
                            {menuCd == 172 ?<>
                            <div class="li_title">
                                <p class="title mgB_30">수료후 연구생 등록</p> 
                                <div class="notitxt2 mgB_40">
                                    <p class="mgB_4 txt">수료자로서 학위취득을 위한 논문을 제출하고자 하는 자 및 논문지도를 받고자 하는 자는 정해진 기간내에 수료후 연구생으로 등록 신청하여야 함.</p>
                                </div>
                                 <ul class="fture n_box mgL_20 mgB_80">
                                    <li>신청방법: 대학원 행정지원팀에서 신청</li>
                                    <li>수료후 연구생 등록자는 신청후 해당 등록금액 납부</li>
                                    <li>등록기간 및 등록금액: 학기별 지정</li>
                                    <li class="txtst">자세한 사항은 학사일정 및 대학원 공지사항을 참조하시기 바랍니다.</li>
                                </ul> 
                            </div>
                            </>:null}*/}
                            {/*최고경영사-특강강사진소개 
                            {menuCd ==161 ?<>
                            <div class='li_title'>
                                <p class="title mgB_24">AMP과정 특강 강사진</p>
                                <div class="is-wauto-box wid_95">
                                    <table class="content_table">
                                        <colgroup>
                                            <col width="25%"></col>
                                            <col width="atuo"></col>
                                            <col width="15%"></col>
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>강사명</th>
                                                <th>소속</th>                                            
                                                <th>비고</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>김난도</td>
                                                <td>서울대학교 교수 / '트렌드코리아' 저자</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>우시흥</td>
                                                <td>부산KBS 아침마당 MC</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>박상우</td>
                                                <td>한국토지주택(LH)공사 사장</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>박권용</td>
                                                <td>동해반점 사장 / '철가방들고 청와대로' 저자</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>박합수</td>
                                                <td>KB국민은행 수석부동산전문위원</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>배동범</td>
                                                <td>창원세무사회 회장</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>배명이</td>
                                                <td>창원지방법원 가사조정위원 / 상속·증여전문가</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>서정환</td>
                                                <td>한국주택금융공사 이사</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>석창목</td>
                                                <td>법무법인 정림 대표변호사</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>손병희</td>
                                                <td>대림산업(주) 주택사업팀 부장</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>유선종</td>
                                                <td>건국대학교 부동산학과 교수</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>이경희</td>
                                                <td>제일감정평가법인 경남지사장?</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>이성수</td>
                                                <td>창신대학교 부동산경매연구소장 / 前경남법무사회 회장</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>전완민</td>
                                                <td>송림한의원 원장</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>주성식</td>
                                                <td>우리은행 김해금융센터 부장</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>정지영</td>
                                                <td>한국공인중개사협회 경남 부지부장</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>조주현</td>
                                                <td>건국대학교 부동산학과 교수</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>최해범</td>
                                                <td>창원대학교 총장</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>한철수</td>
                                                <td>창원상공회의소 회장 / 경남상공회의소협의회 회장</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>홍현식</td>
                                                <td>한국토지주택(LH)공사 주거복지기획처장</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>특별초청</td>
                                                <td>지자체장, 국회의원, 세무·부동산관련 단체장, 프로골퍼 등</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>특별초청</td>
                                                <td>지자체장, 국회의원, 세무·부동산관련 단체장, 프로골퍼 등</td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                        
                                    </table>
                                </div>
                            </div>
                            <p class="mgL_20 mgB_24 txtst">※ 위 강사진은 사정에 따라 변동될 수 있습니다.</p>
                            </>:null}*/}

                            {/*최고경영사-원우 
                            {menuCd ==162 ?<>
                            <div class='li_title'>
                                <p class="title mgB_24">AMP 1기 명단</p>
                                <div class="is-wauto-box">
                                    <table class="content_table">
                                        <colgroup>
                                            <col width="13%"></col>
                                            <col width="18%"></col>
                                            <col width="18%"></col>
                                            <col width="13%"></col>
                                            <col width="8%"></col>
                                        </colgroup>
                                        <thead>
                                        <tr>
                                            <th>성명</th>
                                            <th>직장</th>
                                            <th>소재지</th>
                                            <th>직위</th>
                                            <th>비고</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                            <td>강민주</td>
                                            <td>LBA주공공인중개사</td>
                                            <td>경남 김해시</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>강영호</td>
                                            <td>한성기업</td>
                                            <td>창원시 의창구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>곽윤주</td>
                                            <td>키즈어린이집</td>
                                            <td>창원시마산합포구</td>
                                            <td>원장</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>곽창숙</td>
                                            <td>북면미창외식타워</td>
                                            <td>창원시 의창구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>권태훈</td>
                                            <td>㈜태인씨앤디</td>
                                            <td>창원시마산합포구</td>
                                            <td>상무</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>구동철</td>
                                            <td>인슈마루에이전트</td>
                                            <td>창원시마산회원구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>김경식</td>
                                            <td>미래건설(주)</td>
                                            <td>창원시 성산구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>김동환</td>
                                            <td>경남과학교육원</td>
                                            <td>진주시 진성면</td>
                                            <td>원장</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>김명희</td>
                                            <td>미래건설(주)</td>
                                            <td>창원시 성산구</td>
                                            <td>차장</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>김미형</td>
                                            <td>프리랜서</td>
                                            <td>창원시 의창구</td>
                                            <td>프리랜서</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>김민오</td>
                                            <td>법무법인 마산</td>
                                            <td>창원시마산합포구</td>
                                            <td>변호사</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>김윤희</td>
                                            <td>(사)경남청년창업석세스코칭협회</td>
                                            <td>창원시 성산구</td>
                                            <td>사무국장</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>김용운</td>
                                            <td>마산회원구청</td>
                                            <td>창원시마산회원구</td>
                                            <td>구청장</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>김정기</td>
                                            <td>365마트 구암점</td>
                                            <td>창원시마산회원구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>김정희</td>
                                            <td>삼화꽃농원</td>
                                            <td>창원시 의창구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>김주범</td>
                                            <td>가람경매전문학원</td>
                                            <td>창원시마산합포구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>김찬모</td>
                                            <td>㈜부경</td>
                                            <td>창원시 성산구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>김해영</td>
                                            <td>짬사우나 휘트니스</td>
                                            <td>창원시 의창구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>김현숙</td>
                                            <td>진영가야부동산</td>
                                            <td>경남 김해시</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>노광식</td>
                                            <td>무학신용협동조합</td>
                                            <td>창원시마산회원구</td>
                                            <td>이사장</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>노태수</td>
                                            <td>아리랑관광호텔</td>
                                            <td>창원시마산회원구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>박경혜</td>
                                            <td>산청토지공인중개사</td>
                                            <td>창원시 성산구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>박미혜</td>
                                            <td>아이더 마산점/(사)한국부인회 경상남도</td>
                                            <td>창원시마산합포구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>박민자</td>
                                            <td>우경/경남여성단체협의회</td>
                                            <td>창원시 성산구</td>
                                            <td>대표/고문</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>박상현</td>
                                            <td>케이앤큐여행사</td>
                                            <td>창원시마산합포구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>박애경</td>
                                            <td>㈜거제시민뉴스</td>
                                            <td>경남 거제시</td>
                                            <td>이사</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>배의한</td>
                                            <td>특판상사(롯데)</td>
                                            <td>함안군 칠원읍</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>서정선</td>
                                            <td>한결부동산</td>
                                            <td>창원시 의창구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>성은숙</td>
                                            <td>골드공인중개사사무소</td>
                                            <td>함안군 칠원읍</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>손태화</td>
                                            <td>창원시의회</td>
                                            <td>창원시 의창구</td>
                                            <td>의원</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>손원실</td>
                                            <td>부경주택(주)</td>
                                            <td>창원시 진해구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>심미화</td>
                                            <td>탄화코르크백화점</td>
                                            <td>창원시 성산구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>유영중</td>
                                            <td>한국장례서비스협동조합</td>
                                            <td>창원시마산회원구</td>
                                            <td>이사장</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>이동신</td>
                                            <td>동신건설산업</td>
                                            <td>창원시 의창구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>이영도</td>
                                            <td>㈜태인씨앤디</td>
                                            <td>창원시마산합포구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>이진백</td>
                                            <td>제일감정평가법인</td>
                                            <td>창원시마산합포구</td>
                                            <td>경남지사장</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>임정혜</td>
                                            <td>북면알파</td>
                                            <td>창원시 의창구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>임후근</td>
                                            <td>동부새마을금고</td>
                                            <td>창원시마산회원구</td>
                                            <td>이사장</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>전은숙</td>
                                            <td>땅사공인중개사</td>
                                            <td>창원시 의창구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>정복순</td>
                                            <td>삼성공인중개사</td>
                                            <td>창원시 진해구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>정순국</td>
                                            <td>㈜거제시민뉴스</td>
                                            <td>경남 거제시</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>조윤제</td>
                                            <td>솔C&amp;R(주)</td>
                                            <td>창원시마산합포구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>최정호</td>
                                            <td>경남은행</td>
                                            <td>함안군 칠원읍</td>
                                            <td>차장</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>최종림</td>
                                            <td>일성종합건설</td>
                                            <td>창원시마산회원구</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                            <td>최종열</td>
                                            <td>㈜미래투자개발</td>
                                            <td>경남 거제시</td>
                                            <td>대표</td>
                                            <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            </>:null} */}
                            
                            {/*(박사)부동산경영학과-학과소개
                            {menuCd ==90 ?<>                           
                            <div class="li_title ">
                                <p class="title mgB_12">소개</p>
                                <p class="title_s mgB_120 mgL_10">창신대학교 대학원 부동산 경영학과는 융·복합 교육을 통해 창의력과 전문성을 갖춘 부동산경영 전문가를 양성하며 국가와 지역사회 발전에 기여하는 경남 최고의 부동산 경영대학원을 추구합니다.</p>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_18">비전 및 교육목표</p>
                                <div class="vision under mgB_80">
                                    <p class="label"></p> 
                                    <ul>
                                        <li>1998년 부동산학 학부과정을 개설한 이후 경남의 대표적인 학과로 자리매김 하였으며, 2020학년도부터 박사과정을 개설함으로 학사과정부터 석·박사과정까지 모든 과정을 운영합니다. 경남 최고의 부동산경영학 전문교육기관으로 발전하였으며 부동산경영학 관련 학위과정을 중심으로 이론과 실무를 겸비한 현장중심의 전문가를 양성합니다.</li>
                                    </ul>
                                </div>
                                <div class="edu mgB_120">
                                    <p class="label"></p>                                    
                                    <ul>
                                        <li><div class="num">01.</div><div>부동산학 및 경영학의 이론형성과 건전한 부동산 신산업의 육성에 기여한다.</div></li>
                                        <li><div class="num">02.</div><div>국가 및 지역사회에 봉사하는 창의적이고 진취적인 글로벌 부동산·경영 전문가를 양성한다.</div></li>
                                    </ul>
                                </div>
                                <div class="img_1 mgB_120"><img src="/images/sub/content/general/fe.png"/></div>
                            </div> 
                            
                            <div class="li_title">
                                <p class="title mgB_12">부동산경영학과 특징</p>
                                <ul class="fture mgL_20">
                                    <li>경남 최고의 부동산·경영학 교육 및 연구허브 구축지향</li>
                                    <li>부동산 산업의 종합적이고 체계적인 교육과 연구를 수행하는 부동산·경영학 거점 대학</li>
                                    <li>전문 지식과 국제적 안목을 갖춘 경남 대표적 부동산·경영학 교육 전문기관</li>
                                    <li>학부와 부동산경영대학원의 연계 및 대학원생들의 연륜과 능력을 활용한 부동산 연구네트워크</li>
                                    <li>체계적인 부동산·경영학 관련 연구 및 융·복합 심화 학습</li>
                                    <li>부동산 실무중심주의 교육과정 운영</li>
                                    <li>실용적 지식과 국제적 안목을 갖춘 글로벌 부동산·경영 전문가 육성의 산실</li>
                                    <li>부동산 자산운용 및 관리, 조사분석 및 평가, 개발 및 정책 등 분야별 특화 교육</li>
                                </ul>
                               
                            </div>
                            </>:null}*/} 

                            {/*(박사)부동산경영학과-교과과정 
                            {menuCd ==92 ?<>
                            <div class="li_title">     
                                <p class="title  mgB_24">교과과정</p>
                                <div class="is-wauto-box mgB_100">
                                    <table class="content_table">
                                    <colgroup>
                                        <col width="11%"></col>
                                        <col width="11%"></col>
                                        <col width="11%"></col>
                                        <col width="11%"></col>
                                        <col width="11%"></col>
                                        
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>소속</th>
                                            <th>학위</th>
                                            <th>모집정원</th>
                                            <th>수업연한</th>
                                            <th>비고</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td rowspan="2">부동산경영학과</td>
                                            <td>부동산학 박사</td>
                                            <td rowspan="2">00명</td>
                                            <td rowspan="2"><p>2년</p>(4학기)</td>
                                            <td rowspan="2">주간</td>
                                        </tr>
                                        <tr>
                                            <td  class="borR">경영학 박사</td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="li_title">     
                                <p class="title  mgB_24">부동산경영학과 박사과정 교육과정표</p>
                                <div class="is-wauto-box mgB_60">
                                    <table class="content_table">
                                    <colgroup>
                                        <col width="8%"></col>
                                        <col width="auto"></col>
                                        <col width="6%"></col>
                                        <col width="8%"></col>
                                        <col width="1%"></col>
                                        <col width="8%"></col>
                                        <col width="auto"></col>
                                        <col width="6%"></col>
                                        <col width="8%"></col>
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>구분</th>
                                            <th>교과목명</th>
                                            <th>학점</th>
                                            <th class="borR_none">비고</th>
                                            <th class="none"></th>
                                            <th>구분</th>
                                            <th>교과목명</th>
                                            <th>학점</th>
                                            <th>비고</th>
                                        </tr>
                                    </thead>                                
                                    <tbody>                                
                                    <tr>
                                        <td>논문</td>
                                        <td>박사논문연구지도</td>
                                        <td>2</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        
                                        <td>선택</td>
                                        <td>부동산금융연구
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>논문</td>
                                        <td>박사학위청구논문
                                        </td>
                                        <td>2</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>부동산투자연구
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>부동산정책분석
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>소비자행동연구
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>부동산경매연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"> </td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>부동산조세연구
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>국토도시계획연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>부동산시장분석연구
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>경영정보학연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>부동산컨설팅연구
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>부동산사법연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>부동산정책세미나
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>부동산자산관리연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>부동산개발사례연구
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>부동산개발연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>창업실무세미나
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>부동산입지연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>부동산마케팅연구
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>인사관리연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>해외부동산시장연구
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>부동산기술연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>부동산계량분석연구Ⅱ
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>부동산학세미나
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>부동산민법연구
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>도시재생연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>공간정보체계특론
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>부동산빅데이터연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>민사특별법연구
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>중소기업경영연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>전사적자원관리연구세미나
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>부동산계량분석연구Ⅰ
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>서비스경영사례연구
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>도시및지역관광개발연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>글로벌비즈니스커뮤니케이션연구
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>부동산권리분석연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>경영전략연구세미나
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>경영학연구세미나
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>연구방법론2
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>관광개발인적자원관리연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>기술혁신경영연구
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>글로벌사회와경제연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>최고경영자세미나
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>국제경제세미나
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>글로벌리더십사례세미나
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>글로벌경영사례연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>기업경영분석과M&amp;A전략세미나
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>연구방법론1
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>관광개발경영자산투자세미나
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>경영분석연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>부동산리조트마케팅사례세미나
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>마케팅세미나
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>KCI학술논문사례세미나
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>부동산경제연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>경영정보시스템세미나
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>부동산공법연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>부동산레저경영세미나
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>경영컨설팅연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td class="none"></td>
                                        <td class="none"></td>
                                        <td class="none"></td>
                                        <td class="none"></td>
                                    </tr>
                                    </tbody>
                                    </table>
                                </div> 
                            </div>                           
                            </>:null}*/} 
                            
                            {/*(박사)사회복지학과-학과소개  
                            {menuCd ==94 ?<>                          
                            <div class="li_title">
                                <p class="title mgB_12">소개</p>
                                <p class="title_s mgB_120 mgL_10">창신대학교 일반대학원 사회복지학과는 2020학년도 신설된 젊은 대학원입니다. 특화된 교육과정 및 교육내용을 기반으로 현장중심 사회복지이론과 실제를 학습하고 실천을 고민하며, 현장에서 필요로 하는 전문 지식을 개발하고 연구함으로써 지역사회에서 환영받는 실천형 연구자 양성을 목표로 하고 있습니다.</p>
                           </div>
                           <div class="li_title">
                                <p class="title mgB_18">비전 및 교육목표</p>
                                <p class="title_s mgB_30 mgL_10">창신대학교 일반대학원 간호학과는 봉사의 윤리인, 창의적 전문인, 진취적 세계인을 구현하는 우리 대학교의 인재상과 4차 산업혁명시대의 기본인 CLEAN역량을 토대로 인본주의와 인간존엄성에 근거한 전인적 인간이해와 21세기 보건·의료 환경 변화에 능동적 대처역량을 겸비한 창의적인 글로컬 지도자를 양성하는데 그 목적을 두고 있다. 특히 2018학년도에는 사회적 수요가 급증하는 호스피스 전문간호사 양성과정을 석사과정에 개설하여 운영하고 있다.</p>
                                <div class="vision under mgB_80">
                                    <p class="label"></p> 
                                    <ul>
                                        <li>Professional Global Leader for Universal Social Welfare</li>
                                    </ul>
                                </div>
                                <div class="edu mgB_120">
                                    <p class="label"></p>                                    
                                    <ul>
                                        <li><div class="num">01.</div><div>복지사회를 지향하는 비전제시형 사회복지지도자 양성 </div></li>
                                        <li><div class="num">02.</div><div>지역사회에 필요한 정책·제도자문형 전문 사회복지인 양성</div></li>
                                        <li><div class="num">03.</div><div>변화하는 사회에 적합한 현장밀착형 전문 사회복지인 양성 </div></li>
                                        <li><div class="num">04.</div><div>학문적 소양과 인격적 소양을 두루 갖춘 균형감 있는 사회복지인 양성 </div></li>
                                        <li><div class="num">05.</div><div>글로컬 사회변화 적응에 유연성을 가진 사회복지전문가 양성 </div></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_24">사회복지학과 특징</p>
                                <ul class="fture mgL_20">
                                    <li>사회복지실천 프로그램 개발 및 평가 교육과정 운영</li>
                                    <li>실천평가를 위한 척도개발 및 분석 전문인 양성과정</li>
                                    <li>현장전문가를 위한 정신건강기술개발 교육과정</li>
                                    <li>지역참여형 교과과정 전면 개편 및 운영</li>
                                    <li>매년 논문작성 및 연구방법 세미나 운영</li>
                                    <li>전국 전문가를 잇는 경남사회복지 오픈세미나 운영</li>
                                </ul>
                            </div>
                            </>:null}*/} 

                            {/*(박사)사회복지학과-교과과정   
                            {menuCd ==96 ?<>  
                            <div class="li_title">
                                <p class="title mgB_30">교과과정</p>  
                                <ul class="fture n_box mgL_20 mgB_100">
                                    <li>수업연한 : 2년 (4차 학기)</li>
                                    <li>자격증 : 사회복지사 2급 취득</li>
                                    <li>학 위 : 사회복지학 박사학위</li>
                                    <li>이수학점 : 36학점 이상 (단, 논문연구는 졸업학점에 미포함)</li>
                                    <li>졸업요건 : 36학점 이상 취득, 전공시험 및 외국어 시험</li>
                                </ul> 
                            </div>
                            <div class="li_title">
                                <p class="title mgB_24">사회복지학과 박사과정 교육과정표</p>
                                <div class="is-wauto-box mgB_60">
                                    <table class="content_table">
                                    <colgroup>
                                        <col width="8%"></col>
                                        <col width="auto"></col>
                                        <col width="6%"></col>
                                        <col width="8%"></col>
                                        <col width="1%"></col>
                                        <col width="8%"></col>
                                        <col width="auto"></col>
                                        <col width="6%"></col>
                                        <col width="8%"></col>
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>구분</th>
                                            <th>교과목명</th>
                                            <th>학점</th>
                                            <th class="borR_none">비고</th>
                                            <th class="none"></th>
                                            <th>구분</th>
                                            <th>교과목명</th>
                                            <th>학점</th>
                                            <th>비고</th>
                                        </tr>
                                    </thead>                                
                                        <tbody>     
                                        <tr>
                                            <td>논문</td>
                                            <td>박사논문연구지도</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            
                                            <td>선택</td>
                                            <td>지역사회정신건강서비스</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>논문</td>
                                            <td>박사학위청구논문</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>지역사회자본과사회복지</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>고급연구방법론&nbsp;</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>지역사회복지네트워크론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>빈곤과사회복지</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>현대사회와가족</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>정신장애와가족</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>임상사회복지세미나</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>국제적관점에서본사회복지정책</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>사회서비스실천평가론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>가족문제와상담</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>사회복지프로그램성과측정</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>사회복지사정과척도개발&nbsp;</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>사회문제와비영리조직</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>사회복지프로그램관리론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>주거복지세미나</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>사회복지조직론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>시민사회와자본</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>청소년복지세미나</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>고급연구방법론2</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>정신건강세미나</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>사회복지윤리와인권</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>장애인복지세미나</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>가족복지세미나</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>자산기반사회복지</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>사회복지프로그램세미나</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>사회복지조직세미나</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>사회복지정책세미나</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div> 
                            </div>                           
                            </>:null}   */}

                            {/*(박사)유아교육학과-학과소개 
                            {menuCd ==98 ?<>                           
                            <div class="li_title">
                                <p class="title mgB_12">소개</p>
                                <p class="title_s mgB_120 mgL_10">창신대학교 일반대학원 유아교육학과 박사과정은 미래사회에 필요한 교육역량을 갖춘 유아교육전문가를 양성하기 위해 2025학년도에 신설되며 이론과 실천이 연계 될 수 있는 유아교사들의 전문적인 배움의 장이 되고자 합니다. 4차 산업시대에 발맞추어 미래 유아교사가 갖추어야 할 역량을 기르기 위해 이론 분야의 깊이 있는 학문연구와 더불어 유아교육현장의 다양한 문제를 해결하기 위한 현장실무중심의 교육과정을 운영하여 실천적 능력을 갖춘 유아교육전문가를 양성하고자 합니다.</p>
                           </div>
                           <div class="li_title">
                                <p class="title mgB_18">비전 및 교육목표</p>
                                <p class="title_s mgB_30 mgL_10">창신대학교 일반대학원 간호학과는 봉사의 윤리인, 창의적 전문인, 진취적 세계인을 구현하는 우리 대학교의 인재상과 4차 산업혁명시대의 기본인 CLEAN역량을 토대로 인본주의와 인간존엄성에 근거한 전인적 인간이해와 21세기 보건·의료 환경 변화에 능동적 대처역량을 겸비한 창의적인 글로컬 지도자를 양성하는데 그 목적을 두고 있다. 특히 2018학년도에는 사회적 수요가 급증하는 호스피스 전문간호사 양성과정을 석사과정에 개설하여 운영하고 있다.</p>

                                <div class="vision under mgB_80">
                                    <p class="label"></p> 
                                    <ul>
                                        <li>Academic and Field Competency-Based Education Professional</li>
                                    </ul>
                                </div>
                                <div class="edu mgB_120">
                                    <p class="label"></p>                                    
                                    <ul>
                                        <li><div class="num">01.</div><div>지역사회와 함께 성장하는 교육공동체적 유아교육전문가 양성</div></li>
                                        <li><div class="num">02.</div><div>급변하는 사회에 적합한 현장실무역량형 유아교육전문가 양성</div></li>
                                        <li><div class="num">03.</div><div>인문학적 소양과 인성적 소양을 갖춘 섬김의 유아교육전문가 양성</div></li>
                                        <li><div class="num">04.</div><div>다양한 학문과의 융합을 선도하는 창의적 유아교육전문가 양성</div></li>
                                        <li><div class="num">05.</div><div>새로운 교육패러다임 적응에 유연성을 가진 유아교육전문가 양성</div></li>

                                    </ul>
                                </div>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_24">유아교육학과 특징</p>
                                <p class="li no_m mgB_12">특화된 교육</p>
                                <ul class="fture mgL_20 mgB_24">
                                    <li>맞춤형 교육과정 운영</li>
                                    <li>아동상담 분야를 특화한 교육과정 운영과 풍부한 현장 경력을 갖춘 전임교수 확보</li>
                                    <li>직장과 병행 가능한 주/야간 수업 진행</li>
                                </ul>
                                <p class="li no_m mgB_12">장학특전</p>
                                <ul class="fture mgL_20">
                                    <li>수업료 50% 감면</li>
                                    <li>입학금 면제</li>
                                </ul>
                            </div>
                            </>:null}*/} 

                            {/*(박사)글로벌비즈니스학과-학과소개 */}  
                            {menuCd ==103 ?<>                          
                            {/* <div class='contents_none'>
                                <img src="/images/sub/content/contents_none.png"/>
                                <p class="title">자료를 준비하고 있습니다.</p>
                                <p>더 많은 서비스와 정확한 정보를 전해드리기 위해 준비중입니다.</p>
                                <p>이용에 불편을 드려 죄송합니다.</p>                            
                            </div>                            */}
                            </>:null}

                            {/*(박사)글로벌비즈니스학과-교육과정
                            {menuCd ==105 ?<> 
                            <div class="li_title">
                                <p class="title mgB_18">글로벌비즈니스학과 박사과정 교육과정표</p>                                  
                                <div class="is-wauto-box ">
                                    <table class="content_table">
                                        <colgroup>
                                            <col width="8%"></col>
                                            <col width="auto"></col>
                                            <col width="6%"></col>
                                            <col width="8%"></col>
                                            <col width="1%"></col>
                                            <col width="8%"></col>
                                            <col width="auto"></col>
                                            <col width="6%"></col>
                                            <col width="8%"></col>
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>구분</th>
                                                <th>교과목명</th>
                                                <th>학점</th>
                                                <th class="borR_none">비고</th>
                                                <th class="none"></th>
                                                <th>구분</th>
                                                <th>교과목명</th>
                                                <th>학점</th>
                                                <th>비고</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>논문</td>
                                                <td>박사논문연구지도</td>
                                                <td>2</td>
                                                <td class="borR_none"></td>
                                                <td class="none"></td>
                                                <td>선택</td>
                                                <td>현장연구법Ⅰ</td>
                                                <td>3</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>논문</td>
                                                <td>박사학위청구논문</td>
                                                <td>2</td>
                                                <td class="borR_none"></td>
                                                <td class="none"></td>
                                                <td>선택</td>
                                                <td>영유아융합교육특론</td>
                                                <td>3</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>선택</td>
                                                <td>영유아교수법연구</td>
                                                <td>3</td>
                                                <td class="borR_none"></td>
                                                <td class="none"></td>
                                                <td>선택</td>
                                                <td>조직관리와리더쉽역량개발</td>
                                                <td>3</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>선택</td>
                                                <td>미래사회와영유아교육</td>
                                                <td>3</td>
                                                <td class="borR_none"></td>
                                                <td class="none"></td>
                                                <td>선택</td>
                                                <td>영유아놀이공간과환경특론</td>
                                                <td>3</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>선택</td>
                                                <td>영유아건강교육의생태적접근</td>
                                                <td>3</td>
                                                <td class="borR_none"></td>
                                                <td class="none"></td>
                                                <td>선택</td>
                                                <td>유아생태전환교육연구</td>
                                                <td>3</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>선택</td>
                                                <td>한국전통유아교육연구</td>
                                                <td>3</td>
                                                <td class="borR_none"></td>
                                                <td class="none"></td>
                                                <td>선택</td>
                                                <td>유아교육사상세미나</td>
                                                <td>3</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>선택</td>
                                                <td>세계유아교육동향</td>
                                                <td>3</td>
                                                <td class="borR_none"></td>
                                                <td class="none"></td>
                                                <td>선택</td>
                                                <td>영유아AI멀티미디어교육</td>
                                                <td>3</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>선택</td>
                                                <td>영유아예술교육세미나</td>
                                                <td>3</td>
                                                <td class="borR_none"></td>
                                                <td class="none"></td>
                                                <td>선택</td>
                                                <td>특수아통합교육</td>
                                                <td>3</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>선택</td>
                                                <td>유초연계교육연구</td>
                                                <td>3</td>
                                                <td class="borR_none"></td>
                                                <td class="none"></td>
                                                <td>선택</td>
                                                <td>현장연구법Ⅱ</td>
                                                <td>3</td>
                                                <td></td>
                                            </tr>
                                            </tbody>
                                    </table>
                                </div>
                            </div>
                            </>:null}*/}


                            {/*(박사)간호학과-학과소개   
                            {menuCd ==107 ?<>                         
                            <div class="li_title ">
                                <p class="title mgB_24">소개</p>
                                <p class="title_s mgB_40 mgL_10">창신대학교 일반대학원 간호학과는 봉사의 윤리인, 창의적 전문인, 진취적 세계인을 구현하는 우리 대학교의 인재상과 4차 산업혁명시대의 기본인 CLEAN역량을 토대로 인본주의와 인간존엄성에 근거한 전인적 인간이해와 21세기 보건·의료 환경 변화에 능동적 대처역량을 겸비한 창의적인 글로컬 지도자를 양성하는데 그 목적을 두고 있다. 특히 2018학년도에는 사회적 수요가 급증하는 호스피스 전문간호사 양성과정을 석사과정에 개설하여 운영하고 있다.</p>
                                <p class="li mgB_8 txtst">석·박사 일반과정(성인, 모성, 아동, 정신, 지역사회 간호관리학)</p>
                                <p class="title_s mgL_40 mgB_30">각 간호전공분야의 이론과 연구에 대한 지식을 통합하여 전공분야에서 간호의 수준향상을 위해 교육자 및 상담자, 연구자, 지도자, 변화촉진자, 윤리적 의사결정자의 역할을 수행할 수 있도록 한다.</p>
                                <p class="li mgB_8 txtst">석사 전문간호사과정(호스피스전문간호사)</p>
                                <p class="title_s mgL_40 mgB_120">근거기반간호실무(Evidence based nursing practice)를 임상 현장에서 수행하고 대상자에게 제공되는 의료서비스의 수준향상을 위해 간호전문직 및 타 의료전문직과 함께 협진 할 수 있는 능력을 갖춘 전문간호 사를 배출하여 이들이 다학제팀의 구성원으로서 임상현장에서 전문가적 간호실무수행자, 교육자 및 상담자의 역할을 수행할 수 있도록 한다.</p>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_24">비전 및 교육목표</p>
                                <p class="title_s mgB_80 mgL_10">창신대학교 일반대학원 간호학과는 봉사의 윤리인, 창의적 전문인, 진취적 세계인을 구현하는 우리 대학교의 인재상과 4차 산업혁명시대의 기본인 CLEAN역량을 토대로 인본주의와 인간존엄성에 근거한 전인적 인간이해와 21세기 보건·의료 환경 변화에 능동적 대처역량을 겸비한 창의적인 글로컬 지도자를 양성하는데 그 목적을 두고 있다. 특히 2018학년도에는 사회적 수요가 급증하는 호스피스 전문간호사 양성과정을 석사과정에 개설하여 운영하고 있다.</p>
                                <div class="vision under mgB_80">
                                    <p class="label"></p> 
                                    <ul>
                                        <li>Glocal Nursing Leader with Creativity, Credible, Competence</li>
                                    </ul>
                                </div>
                                <div class="edu mgB_120">
                                    <p class="label"></p>                                    
                                    <ul>
                                        <li><div class="num">01.</div><div>전인적 돌봄 간호를 창의적으로 수행하는 임상간호전문가의 역할을 수행한다.</div></li>
                                        <li><div class="num">02.</div><div>근거간호실무의 발전을 위한 과학적 연구자의 역할을 수행한다.</div></li>
                                        <li><div class="num">03.</div><div>합리적 사고와 문제해결력을 겸비한 유능한 간호지도자의 역할을 수행한다.</div></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_24">간호학과 특징</p>
                                <ul class="fture mgL_20">
                                    <li>전문성과 풍부한 임상경력을 갖춘 전임교수확보를 통한 양질의 교육제공</li>
                                    <li>논문연구 지도교수제를 통한 대학원 4학기 내 석사학위취득 지원</li>
                                    <li>국내외 다양한 학술세미나참여를 통한 연구 및 통계 처리 능력 함양</li>
                                    <li>경남일대 최초 호스피스 전문간호사 교육기관 지정 인증 획득(보건복지부장관, 2017. 9. 7)</li>
                                    <li>권역 내 호스피스 전문기관 임상실습지 확보 및 가정형 호스피스 확보</li>
                                    <li>교수학습지원센터 운영을 통한 학습 편의성 제공(podcast, 동영상upload)</li>
                                </ul>
                            </div>
                            </>:null} */}

                            {/*(박사)간호학과-교육과정   
                            {menuCd ==109 ?<>
                            <div class="li_title">                       
                                <p class="title mgB_24">간호학과 박사과정 교육과정표</p>
                                <div class="is-wauto-box mgB_60">
                                    <table class="content_table">
                                    <colgroup>
                                        <col width="8%"></col>
                                        <col width="auto"></col>
                                        <col width="6%"></col>
                                        <col width="8%"></col>
                                        <col width="1%"></col>
                                        <col width="8%"></col>
                                        <col width="auto"></col>
                                        <col width="6%"></col>
                                        <col width="8%"></col>
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>구분</th>
                                            <th>교과목명</th>
                                            <th>학점</th>
                                            <th class="borR_none">비고</th>
                                            <th class="none"></th>
                                            <th>구분</th>
                                            <th>교과목명</th>
                                            <th>학점</th>
                                            <th>비고</th>
                                        </tr>
                                    </thead>
                                    <tbody>      
                                        <tr>
                                            <td>논문</td>
                                            <td>박사논문연구지도</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>        
                                            <td>선택</td>
                                            <td>노인복지와간호</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>논문</td>
                                            <td>박사학위청구논문</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>종양학개론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>필수</td>
                                            <td>상급간호연구</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>근거기반간호실무</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>필수</td>
                                            <td>간호과학철학</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>보건정책과간호이슈</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>간호이론개발</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>간호세미나</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>상급통계</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>전략적조직관리</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>교육의실제</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>질적연구방법</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>병태생리학</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>감염과환자안전</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>약리학</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>통증및증상완화간호</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>호스피스·완화간호총론</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>상급건강사정및실습</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>심리사회간호·영적간호와상담</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>인간생명과연구윤리</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>학술세미나1</td>
                                            <td>1</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>상급모아간호</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>학술세미나2</td>
                                            <td>1</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>상급정신간호</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>사별가족간호</td>
                                            <td>1</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>보건의료경영과리더쉽</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>상급의사소통및실습</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>재난과응급간호</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>만성질환자자가관리</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td class="none"></td>
                                            <td class="none"></td>
                                            <td class="none"></td>
                                            <td class="none"></td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div>
                            </div> 
                            </>:null}*/}

                            {/*(박사)미용학과-학과소개 
                            {menuCd == 111 ?<>                          
                            <div class="li_title">
                                <p class="title mgB_12">소개</p>
                                <p class="title_s mgB_80 mgL_10">창신대학교 미용예술학과는 경상남도 유일의 4년제 미용학과로 2017학년도 특수대학원 석사과정을 개설하였고 2023학년도 일반대학원 박사과정을 신설하였다. 미용산업 현장에서 필요로 하는 새로운 기술과 뷰티트렌드를 연구, 개발함으로써 지역사회 미용산업 발전과 K뷰티 확산에 기여할 수 있는 창의적 리더 양성을 목표로 한다.</p>
                           </div>
                           <div class="li_title">
                                <p class="title mgB_18">비전 및 교육목표</p>
                                <div class="vision under mgB_80">
                                    <p class="label"></p> 
                                    <ul>
                                        <li>Creative Professionals Leading the Beauty Trend</li>
                                    </ul>
                                </div>
                                <div class="edu mgB_120">
                                    <p class="label"></p>                                    
                                    <ul>
                                        <li><div class="num">01.</div><div>사회변화에 유연하게 대처할 수 있는 미래형 리더 양성</div></li>
                                        <li><div class="num">02.</div><div>학문적 성과를 현장에 접목할 수 있는 경영자 양성</div></li>
                                        <li><div class="num">03.</div><div>프로젝트를 기획 및 수행할 수 있는 뷰티디렉터 양성</div></li>
                                        <li><div class="num">04.</div><div>국내외 미용정책과 트렌드에 신속하게 대응할 수 있는 글로벌 인재 양성</div></li>
                                        <li><div class="num">05.</div><div>변화하는 교육환경에 주도적으로 대처하는 미용교육 전문가 양성</div></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_24">미용예술학과 특징</p>
                                <ul class="fture mgL_20">
                                    <li>미용교육전문가, 현장경영전문가, 연구개발전문가 맞춤형 교육과정 운영</li>
                                    <li>헤어, 메이크업, 피부, 네일 세부전공 맞춤형 교육과정</li>
                                    <li>국내외 학회 및 작품전시회 참여</li>
                                    <li>최신트렌드 정보세미나, 기술세미나 운영</li>
                                    <li>연구방법 및 논문작성 세미나 운영</li>
                                    <li>해외 교류대학과 공동 세미나 운영</li>
                                    <li>매학기 등록금 장학혜택</li>
                                </ul>
                            </div>
                            </>:null}*/}
                            
                            {/*(박사)미용예술학과-교과과정
                            {menuCd == 113 ?<>    
                            <div class="li_title">
                                <p class="title mgB_18">교과과정</p>
                                <ul class="fture n_box mgL_20 mgB_100">
                                    <li>수업연한 : 2년(4차 학기)</li>
                                    <li>학 위 : 미용예술학 박사학위</li>
                                </ul>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_18">미용예술학과 박사과정 교육과정표</p>                                  
                                <div class="is-wauto-box">
                                <table class="content_table">
                                <colgroup>
                                    <col width="8%"></col>
                                    <col width="auto"></col>
                                    <col width="6%"></col>
                                    <col width="8%"></col>
                                    <col width="1%"></col>
                                    <col width="8%"></col>
                                    <col width="auto"></col>
                                    <col width="6%"></col>
                                    <col width="8%"></col>
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>구분</th>
                                        <th>교과목명</th>
                                        <th>학점</th>
                                        <th class="borR_none">비고</th>
                                        <th class="none"></th>
                                        <th>구분</th>
                                        <th>교과목명</th>
                                        <th>학점</th>
                                        <th>비고</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>논문</td>
                                        <td>박사논문연구지도</td>
                                        <td>2</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>빅데이터세미나</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>논문</td>
                                        <td>박사학위청구논문</td>
                                        <td>2</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>고급통계학</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>한방미용학특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>빅데이터관리론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>디지털뷰티산업연구</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>네일조형연구</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>메이크업과미학</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>메이크업디자인특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>이미지커트연구</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>최신디자인펌연구</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>교육의실제</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>비만체형관리연구</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>헬스케어산업연구</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>전략적조직관리</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>고령사회와뷰티산업</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>미용체질학연구</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>뷰티디자인특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>조형예술과미학</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>미용문화연구</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>글로벌마케팅연구</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>교수법연구</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>화장품광고마케팅</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>미용통계특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>연구방법론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>화장품학특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>혁신교수법특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>건강의학특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>AI뷰티트렌드</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    </tbody>

                                </table>
                                </div>
                            </div>                                                      
                            </>:null}*/}

                            {/*(박사)스마트융합공학부-학과소개  
                            {menuCd ==115 ?<>                           
                            <div class="li_title">
                                <p class="title mgB_12">소개</p>
                                <p class="title_s mgB_30 mgL_10">창신대학교 일반대학원 스마트융합공학부는 4차산업혁명 시대에서 다분야 지식, 기술 및 역량을 갖춘 미래형 융합적 공학 전문 기술인을 양성하기 위해 소방방재공학전공, 항공기계공학전공, 컴퓨터공학전공의 3개 전공이 학제적 연계(interdisciplinary) 구성되어 있으며, 총정원제 공학석사·공학박사 학위과정으로 운영됩니다.</p>
                                <p class="li mgB_12">1.1. 소방방재공학전공</p>
                                <p class="mgL_40 mgB_24">소방방재공학전공은 전기공학, 기계공학, 건축공학, 재난관리, 컴퓨터공학 및 ICT 등의 특성화된 융합·공학적 전공지식과 현장 맞춤형 실무능력을 겸비한 소방ICT분야 고급기술 전문인력 양성을 목표로 하고 있습니다.</p>
                                <p class="li mgB_12">1.2. 항공기계공학전공</p>
                                <p class="mgL_40 mgB_24">항공기계공학전공은 첨단 항공기계 분야에서 글로벌 시대를 선도할 설계, 해석 능력을 갖춘 엔지니어를 양성하고 공인된 국토교통부 항공정비사 전문교육기관으로 지역(경남항공국가산단) 및 국가적 수요(항공MRO)에 수요에 부합하는 교육을 진행하고 있습니다.</p>
                                <p class="li mgB_12">1.3. 컴퓨터공학전공</p>
                                <p class="mgL_40 mgB_80">컴퓨터공학전공은 경상남도 및 창원시 기반 지역특화산업(스마트산단, 지능형 생산기계, 소재부품, 항공 및 차량기계부품 등) 고도화를 위한 맞춤형 특성화 교육과 산학연협력기술개발 연구를 통해 현장실무 능력과 R&D역량을 겸비한 창의 융·복합형 지역주력산업 선도 인재 양성을 목표로 하고 있습니다.</p>
                           
                           </div>
                           <div class="li_title">
                                <p class="title mgB_18">비전 및 교육목표</p>
                                <div class="vision under mgB_80">
                                    <p class="label"></p> 
                                    <ul>
                                        <li>Professional Scientists and Engineers in Smart Convergence Technology</li>
                                    </ul>
                                </div>
                                <div class="edu mgB_120">
                                    <p class="label"></p>                                    
                                    <ul>
                                        <li><div class="num">01.</div><div>디지털시대, 그린혁명시대 첨단(신기술) 분야 선도할 디지털 신기술 혁신 인재 양성</div></li>
                                        <li><div class="num">02.</div><div>R&D를 자기주도적 수행하며 융복합/종합적 설계·해석하는 창의적 연구인 양성</div></li>
                                        <li><div class="num">03.</div><div>올바른 직업윤리관과 지성과 덕성을 갖춘 감성적 스마트 공학인 양성</div></li>
                                        <li style={{ paddingTop:'0px'}}>
                                            <div class="li_title">
                                                <p class="li_s mgL_40 mgB_8">국가와 지역기반 산업요구에 부합하는 현장맞춤형 전문 고급 실무인재 양성</p>
                                                <p class="li_s mgL_40 mgB_8">소방공무원 및 국가 기술 자격을 갖춘 전문 기술인</p>
                                                <p class="li_s mgL_40 mgB_8">첨단 항공정비, 기계공학 다분야 설계, 해석능력을 갖춘 고급 엔지니어</p>
                                                <p class="li_s mgL_40 ">ICT 기반 스마트팩토리, 소재부품융합, 전기기계융합분야 지역산업 신기술 융합 혁신인</p>
                                            </div>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_24">스마트융합공학부 특징</p>
                                <ul class="fture mgL_20">
                                    <li>산·학·연 협력체계로 특성화된 각 전문분야 교육 및 연구</li>
                                    <li>평생멘토제를 통한 교육 및 연구 지도로 대학원 4학기 내 석사학위 취득 지원</li>
                                    <li>산업현장에서 필요한 첨단 신기술과 전문지식의 융합을 통하여 실무능력 향상</li>
                                    <li>지역산업 현장맞춤형 엔지니어링 시뮬레이션 특화 실무 전공교육</li>
                                </ul>
                                <div class="li_title">
                                    <p class="li_s mgL_50 mgB_8">융·복합 가상공학해석(CAE)</p>
                                    <p class="li_s mgL_50 mgB_8">성능위주소방설계</p>
                                    <p class="li_s mgL_50 mgB_8">화재피난시뮬레이션</p>
                                    <p class="li_s mgL_50 mgB_8">디지털 트윈</p>
                                    <p class="li_s mgL_50 mgB_8">최적화 & 역설계</p>
                                    <p class="li_s mgL_50 mgB_8">항공기계 유동해석</p>
                                    <p class="li_s mgL_50 mgB_8">소재부품장비 설계</p>
                                    <p class="li_s mgL_50 mgB_8">항공MRO</p>
                                    <p class="li_s mgL_50 mgB_8">드론 및 자율주행차 네트워크</p>
                                    <p class="li_s mgL_50 mgB_8">지능형로보틱스 및 스마트시티 연구</p>
                                    <p class="li_s mgL_50 mgB_8">인공지능 및 IoT 기반 스마트팩토리</p>
                                    <p class="li_s mgL_50 mgB_8">커넥티드 스마트 시스템 설계</p>
                                    <p class="li_s mgL_50 mgB_8">공정 빅데이터 실시간 수집 및 분석</p>
                                    <p class="li_s mgL_50 mgB_18">미래자동차 및 에너지신산업 R&D</p></div> 
                                </div>
                                <ul class="fture mgL_20">
                                    <li>전일제/비전일제 대학원생을 위한 최대 학습 지원</li>
                                </ul>
                                <div class="li_title">
                                    <p class="li_s mgL_50 mgB_8">전일제(Full-time) 대학원생 면학 및 연구장학 지원</p>
                                    <p class="li_s mgL_50 mgB_8">최신시설의 대학원 전용 기숙사 제공</p>
                                    <p class="li_s mgL_50 mgB_8">공무원 및 산업체 재직자를 위한 비전일제(Part time) 대학원생 면학장학 지원</p>
                                    <p class="li_s mgL_50 mgB_8">산학협력체계를 통한 산업체의 산학공동기술개발 및 애로기술 해결 지원</p>
                                    <p class="li_s mgL_50 mgB_8">시간적 제약이 있는 실무종사자를 위한 야간 대학원강좌 개설 및 운영</p>
                                    <p class="li_s mgL_50 mgB_18">각 세부전공별 대학원 연구실의 개인 공간 제공</p>  
                                </div>
                                <ul class="fture mgL_20">
                                    <li>대학원 외국인 유학생을 위한 Study in Korea 프로그램</li>
                                </ul>
                                <div class="li_title">
                                    <p class="li_s mgL_50 mgB_8">대학 특별 장학금 지원</p>
                                    <p class="li_s mgL_50 mgB_8">우수 자비유학생 장학 지원</p>
                                    <p class="li_s mgL_50 mgB_8">재단 및 기업 장학금 지원</p>
                                    <p class="li_s mgL_50 mgB_8">Global Korea Scholarship 지원</p>
                                    <p class="li_s mgL_50 mgB_8">외국인유학생 기숙사 지원(부울경 최소비용)</p>
                                </div>
                            </>:null}*/}

                            {/*(박사)스마트융합공학부-교육과정    
                            {menuCd == 117 ?<>   
                            <div class="li_title">
                                <p class="title mgB_30">스마트융합공학부 박사과정 교육과정표</p>                              
                                <div class="is-wauto-box">
                                    <table class="content_table">
                                    <colgroup>
                                        <col width="8%"></col>
                                        <col width="auto"></col>
                                        <col width="6%"></col>
                                        <col width="8%"></col>
                                        <col width="1%"></col>
                                        <col width="8%"></col>
                                        <col width="auto"></col>
                                        <col width="6%"></col>
                                        <col width="8%"></col>
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>구분</th>
                                            <th>교과목명</th>
                                            <th>학점</th>
                                            <th class="borR_none">비고</th>
                                            <th class="none"></th>
                                            <th>구분</th>
                                            <th>교과목명</th>
                                            <th>학점</th>
                                            <th>비고</th>
                                        </tr>
                                    </thead>                                    
                                    <tbody>      
                                        <tr>
                                            <td>논문</td>
                                            <td>박사논문연구지도</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>한국어공학논문작성특론2</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>논문</td>
                                            <td>박사학위청구논문</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>현장실무3</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>스마트융합공학세미나1</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>현장실무4</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>스마트융합공학세미나2</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>현장연구3</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>과학논문작성및프리젠테이션</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>현장연구4</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>CAE특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>영어논문작성및영어학술발표</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>공간정보체계특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>전산응용수치해석</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>전기안전특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>전기화재특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>전기기계설계특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>화재피난시뮬레이션특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>위험물질특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>도시방재특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>소방관계법특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>열전달특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>유체역학특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>화재역학특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>열역학특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>화재위험성평가특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>연소공학특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>제연시스템특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>소방기계설비특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>방화공학특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>소방설계및시공특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>건축방재계획특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>성능위주설계특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>재난안전공학특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>건축재료및구조특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>열화상분석특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>계측공학특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>항공우주공학특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>미분방정식특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>전자유체특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>고체역학특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>CAD/CAM특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>운영체제특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>재료과학특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>인공지능특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>항공역학특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>시스템스토리지특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            
                                            <td>선택</td>
                                            <td>전산유체특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>알고리즘설계및분석</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>임베디드운영체제</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>컴퓨터네트워크특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>그래프이론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>멀티미디어시스템특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>기계학습특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>시스템프로그래밍특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>데이터베이스특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>모바일임베디드시스템</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>컴퓨터망특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>IoT임베디드소프트웨어</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>무선네트워크특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>임베디드클라우드엣지컴퓨팅</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>모바일프로그래밍특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>분산시스템</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>유비쿼터스컴퓨팅특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>화재모델링특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>컴퓨터보안</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>한국어공학논문작성특론1</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>빅데이터분석특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div> 
                            </div>
                            </>:null} */}


{/* ########################  석사 */} 
                            {/*(석사)간호학과-학과소개 
                            {menuCd == 119 ?<>                            
                            <div class="li_title ">
                                <p class="title mgB_12">소개</p>
                                <p class="title_s mgB_30 mgL_10">창신대학교 일반대학원 간호학과는 봉사의 윤리인, 창의적 전문인, 진취적 세계인을 구현하는 우리 대학교의 인재상과 4차 산업혁명시대의 기본인 CLEAN역량을 토대로 인본주의와 인간존엄성에 근거한 전인적 인간이해와 21세기 보건·의료 환경 변화에 능동적 대처역량을 겸비한 창의적인 글로컬 지도자를 양성하는데 그 목적을 두고 있다. 특히 2018학년도에는 사회적 수요가 급증하는 호스피스 전문간호사 양성과정을 석사과정에 개설하여 운영하고 있다.</p>
                                <p class="li mgB_8 txtst">석·박사 일반과정(성인, 모성, 아동, 정신, 지역사회 간호관리학)</p>
                                <p class="title_s mgL_40 mgB_30 font_s_14">각 간호전공분야의 이론과 연구에 대한 지식을 통합하여 전공분야에서 간호의 수준향상을 위해 교육자 및 상담자, 연구자, 지도자, 변화촉진자, 윤리적 의사결정자의 역할을 수행할 수 있도록 한다.</p>
                                <p class="li mgB_8 txtst">석사 전문간호사과정(호스피스전문간호사)</p>
                                <p class="title_s mgL_40 mgB_80 font_s_14">근거기반간호실무(Evidence based nursing practice)를 임상 현장에서 수행하고 대상자에게 제공되는 의료서비스의 수준향상을 위해 간호전문직 및 타 의료전문직과 함께 협진 할 수 있는 능력을 갖춘 전문간호 사를 배출하여 이들이 다학제팀의 구성원으로서 임상현장에서 전문가적 간호실무수행자, 교육자 및 상담자의 역할을 수행할 수 있도록 한다.</p>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_18">비전 및 교육목표</p>
                                <p class="title_s mgB_30 mgL_10">창신대학교 일반대학원 간호학과는 봉사의 윤리인, 창의적 전문인, 진취적 세계인을 구현하는 우리 대학교의 인재상과 4차 산업혁명시대의 기본인 CLEAN역량을 토대로 인본주의와 인간존엄성에 근거한 전인적 인간이해와 21세기 보건·의료 환경 변화에 능동적 대처역량을 겸비한 창의적인 글로컬 지도자를 양성하는데 그 목적을 두고 있다. 특히 2018학년도에는 사회적 수요가 급증하는 호스피스 전문간호사 양성과정을 석사과정에 개설하여 운영하고 있다.</p>

                                <div class="vision under mgB_80">
                                    <p class="label"></p> 
                                    <ul>
                                        <li> Glocal Nursing Leader with Creativity, Credible, Competence</li>
                                    </ul>
                                </div>
                                <div class="edu mgB_120">
                                    <p class="label"></p>                                    
                                    <ul>
                                        <li><div class="num">01.</div><div>전인적 돌봄 간호를 창의적으로 수행하는 임상간호전문가의 역할을 수행한다.</div></li>
                                        <li><div class="num">02.</div><div>근거간호실무의 발전을 위한 과학적 연구자의 역할을 수행한다.</div></li>
                                        <li><div class="num">03.</div><div>합리적 사고와 문제해결력을 겸비한 유능한 간호지도자의 역할을 수행한다.</div></li>

                                    </ul>
                                </div>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_24">간호학과 특징</p>
                                <ul class="fture mgL_40">
                                    <li>전문성과 풍부한 임상경력을 갖춘 전임교수확보를 통한 양질의 교육제공</li>
                                    <li>논문연구 지도교수제를 통한 대학원 4학기 내 석사학위취득 지원</li>
                                    <li>국내외 다양한 학술세미나참여를 통한 연구 및 통계 처리 능력 함양</li>
                                    <li>경남일대 최초 호스피스 전문간호사 교육기관 지정 인증 획득(보건복지부장관, 2017. 9. 7)</li>
                                    <li>권역 내 호스피스 전문기관 임상실습지 확보 및 가정형 호스피스 확보</li>
                                    <li>교수학습지원센터 운영을 통한 학습 편의성 제공(podcast, 동영상upload)</li>
                                </ul>
                            </div>
                            </>:null}  */}   

                            {/*(석사)간호학과-교과과정                                                     
                            {menuCd ==121 ?<>
                            <div class="li_title">
                                <p class="title mgB_18">간호학과 석사과정 교육과정표(간호학전공)</p>
                                <div class="is-wauto-box mgB_60">
                                <table class="content_table  of_n">
                                <colgroup>
                                    <col width="8%"></col>
                                    <col width="auto"></col>
                                    <col width="6%"></col>
                                    <col width="8%"></col>
                                    <col width="1%"></col>
                                    <col width="8%"></col>
                                    <col width="auto"></col>
                                    <col width="6%"></col>
                                    <col width="8%"></col>
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>구분</th>
                                        <th>교과목명</th>
                                        <th>학점</th>
                                        <th class="borR_none">비고</th>
                                        <th class="none"></th>
                                        <th>구분</th>
                                        <th>교과목명</th>
                                        <th>학점</th>
                                        <th>비고</th>
                                    </tr>
                                </thead>
                                <tbody>                                    
                                    <tr>
                                        <td>논문</td>
                                        <td>
                                        석사논문연구지도
                                        </td>
                                        <td>2</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        학술세미나2
                                        </td>
                                        <td>1</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>논문</td>
                                        <td>
                                        석사학위청구논문
                                        </td>
                                        <td>2</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        보건정책과간호이슈
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>필수</td>
                                        <td>
                                        간호연구
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        교육의실제
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>필수</td>
                                        <td>
                                        간호통계
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>필수</td>
                                        <td>
                                        간호이론
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>
                                        상급의사소통및실습
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        상급정신간호
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>
                                        노인복지와간호
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        재난과응급간호
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>
                                        종양학개론
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        보건의료경영과리더쉽
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>
                                        만성질환자자가관리
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        상급모아간호
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>
                                        근거기반간호실무
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        질적연구방법
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>
                                        학술세미나1
                                        </td>
                                        <td>1</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td class="none"></td>
                                        <td class="none"></td>
                                        <td class="none"></td>
                                        <td class="none"></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            </div> 
                            <div class="li_title">
                                <p class="title mgB_18">간호학과 석사과정 교육과정표(호스피스전문간호사전공)</p>
                                <div class="is-wauto-box mgB_60">
                                <table class="content_table of_n">
                                <colgroup>
                                    <col width="13%"></col>
                                    <col width="auto"></col>
                                    <col width="16%"></col>
                                    <col width="16%"></col>
                                    <col width="13%"></col>
                                    
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>학기</th>
                                        <th>교과목명</th>
                                        <th>구분</th>
                                        <th>학점</th>
                                        <th>비고</th>                                        
                                    </tr>
                                </thead>                                
                                <tbody>
                                    <tr>
                                        <td rowspan="3">1</td>
                                        <td>간호연구</td>
                                        <td>필수</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>병태생리학</td>
                                        <td>필수</td>
                                        <td>2</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>호스피스·완화간호총론</td>
                                        <td>필수</td>
                                        <td>2</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td rowspan="4">2</td>
                                        <td>간호이론</td>
                                        <td>필수</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>상급건강사정및실습</td>
                                        <td>필수</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>통증및증상완화간호</td>
                                        <td>필수</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>호스피스간호실습1&nbsp;</td>
                                        <td>필수</td>
                                        <td>2</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td rowspan="3">3</td>
                                        <td>약리학</td>
                                        <td>필수</td>
                                        <td>2</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>심리사회간호·영적간호와상담</td>
                                        <td>필수</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>호스피스간호실습2&nbsp;</td>
                                        <td>필수</td>
                                        <td>2</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td rowspan="5">4</td>
                                        <td>사별가족간호</td>
                                        <td>필수</td>
                                        <td>1</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>전문간호사역할과정책</td>
                                        <td>필수</td>
                                        <td>2</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>호스피스운영관리</td>
                                        <td>필수</td>
                                        <td>1</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>호스피스간호실습3</td>
                                        <td>필수</td>
                                        <td>2</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>석사논문연구지도</td>
                                        <td>논문</td>
                                        <td>2</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td rowspan="2">5</td>
                                        <td>호스피스간호실습4</td>
                                        <td>필수</td>
                                        <td>4</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>석사학위청구논문</td>
                                        <td>논문</td>
                                        <td>2</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td colspan="5">무논문 경우: 35학점, 논문제출: 39학점</td>
                                    </tr>
                                    </tbody> 
                                </table>
                            </div>
                            </div> 
                            </>:null} */}
                            
                            {/*(석사)스마트융합공학부-학과소개  
                            {menuCd == 123 ?<>                          
                            <div class="li_title">
                                <p class="title mgB_12">소개</p>
                                <p class="title_s mgB_30 mgL_10">창신대학교 일반대학원 스마트융합공학부는 4차산업혁명 시대에서 다분야 지식, 기술 및 역량을 갖춘 미래형 융합적 공학 전문 기술인을 양성하기 위해 소방방재공학전공, 항공기계공학전공, 컴퓨터공학전공의 3개 전공이 학제적 연계(interdisciplinary) 구성되어 있으며, 총정원제 공학석사·공학박사 학위과정으로 운영됩니다.</p>
                                <p class="li mgB_12">1.1. 소방방재공학전공</p>
                                <p class="mgL_40 mgB_24">소방방재공학전공은 전기공학, 기계공학, 건축공학, 재난관리, 컴퓨터공학 및 ICT 등의 특성화된 융합·공학적 전공지식과 현장 맞춤형 실무능력을 겸비한 소방ICT분야 고급기술 전문인력 양성을 목표로 하고 있습니다.</p>
                                <p class="li mgB_12">1.2. 항공기계공학전공</p>
                                <p class="mgL_40 mgB_24">항공기계공학전공은 첨단 항공기계 분야에서 글로벌 시대를 선도할 설계, 해석 능력을 갖춘 엔지니어를 양성하고 공인된 국토교통부 항공정비사 전문교육기관으로 지역(경남항공국가산단) 및 국가적 수요(항공MRO)에 수요에 부합하는 교육을 진행하고 있습니다.</p>
                                <p class="li mgB_12">1.3. 컴퓨터공학전공</p>
                                <p class="mgL_40 mgB_100">컴퓨터공학전공은 경상남도 및 창원시 기반 지역특화산업(스마트산단, 지능형 생산기계, 소재부품, 항공 및 차량기계부품 등) 고도화를 위한 맞춤형 특성화 교육과 산학연협력기술개발 연구를 통해 현장실무 능력과 R&D역량을 겸비한 창의 융·복합형 지역주력산업 선도 인재 양성을 목표로 하고 있습니다.</p>
                           
                           </div>
                           <div class="li_title">
                                <p class="title mgB_18">비전 및 교육목표</p>
                                <div class="vision under mgB_80">
                                    <p class="label"></p> 
                                    <ul>
                                        <li>Professional Scientists and Engineers in Smart Convergence Technology</li>
                                    </ul>
                                </div>
                                <div class="edu mgB_120">
                                    <p class="label"></p>                                    
                                    <ul>
                                        <li><div class="num">01.</div><div>디지털시대, 그린혁명시대 첨단(신기술) 분야 선도할 디지털 신기술 혁신 인재 양성</div></li>
                                        <li><div class="num">02.</div><div>R&D를 자기주도적 수행하며 융복합/종합적 설계·해석하는 창의적 연구인 양성</div></li>
                                        <li><div class="num">03.</div><div>올바른 직업윤리관과 지성과 덕성을 갖춘 감성적 스마트 공학인 양성</div></li>
                                        <li style={{ paddingTop:'0px',fontWeight: "400"}}>
                                            <div class="li_title">
                                                <p class="li_s mgL_40 mgB_8">국가와 지역기반 산업요구에 부합하는 현장맞춤형 전문 고급 실무인재 양성</p>
                                                <p class="li_s mgL_40 mgB_8">소방공무원 및 국가 기술 자격을 갖춘 전문 기술인</p>
                                                <p class="li_s mgL_40 mgB_8">첨단 항공정비, 기계공학 다분야 설계, 해석능력을 갖춘 고급 엔지니어</p>
                                                <p class="li_s mgL_40 ">ICT 기반 스마트팩토리, 소재부품융합, 전기기계융합분야 지역산업 신기술 융합 혁신인</p>
                                            </div>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_24">스마트융합공학부 특징</p>
                                <ul class="fture mgL_20">
                                    <li>산·학·연 협력체계로 특성화된 각 전문분야 교육 및 연구</li>
                                    <li>평생멘토제를 통한 교육 및 연구 지도로 대학원 4학기 내 석사학위 취득 지원</li>
                                    <li>산업현장에서 필요한 첨단 신기술과 전문지식의 융합을 통하여 실무능력 향상</li>
                                    <li>지역산업 현장맞춤형 엔지니어링 시뮬레이션 특화 실무 전공교육</li>
                                </ul>
                                <div class="li_title">
                                    <p class="li_s mgL_50 mgB_8">융·복합 가상공학해석(CAE)</p>
                                    <p class="li_s mgL_50 mgB_8">성능위주소방설계</p>
                                    <p class="li_s mgL_50 mgB_8">화재피난시뮬레이션</p>
                                    <p class="li_s mgL_50 mgB_8">디지털 트윈</p>
                                    <p class="li_s mgL_50 mgB_8">최적화 & 역설계</p>
                                    <p class="li_s mgL_50 mgB_8">항공기계 유동해석</p>
                                    <p class="li_s mgL_50 mgB_8">소재부품장비 설계</p>
                                    <p class="li_s mgL_50 mgB_8">항공MRO</p>
                                    <p class="li_s mgL_50 mgB_8">드론 및 자율주행차 네트워크</p>
                                    <p class="li_s mgL_50 mgB_8">지능형로보틱스 및 스마트시티 연구</p>
                                    <p class="li_s mgL_50 mgB_8">인공지능 및 IoT 기반 스마트팩토리</p>
                                    <p class="li_s mgL_50 mgB_8">커넥티드 스마트 시스템 설계</p>
                                    <p class="li_s mgL_50 mgB_8">공정 빅데이터 실시간 수집 및 분석</p>
                                    <p class="li_s mgL_50 mgB_18">미래자동차 및 에너지신산업 R&D</p></div> 
                                </div>
                                <ul class="fture mgL_20">
                                    <li>전일제/비전일제 대학원생을 위한 최대 학습 지원</li>
                                </ul>
                                <div class="li_title">
                                    <p class="li_s mgL_50 mgB_8">전일제(Full-time) 대학원생 면학 및 연구장학 지원</p>
                                    <p class="li_s mgL_50 mgB_8">최신시설의 대학원 전용 기숙사 제공</p>
                                    <p class="li_s mgL_50 mgB_8">공무원 및 산업체 재직자를 위한 비전일제(Part time) 대학원생 면학장학 지원</p>
                                    <p class="li_s mgL_50 mgB_8">산학협력체계를 통한 산업체의 산학공동기술개발 및 애로기술 해결 지원</p>
                                    <p class="li_s mgL_50 mgB_8">시간적 제약이 있는 실무종사자를 위한 야간 대학원강좌 개설 및 운영</p>
                                    <p class="li_s mgL_50 mgB_18">각 세부전공별 대학원 연구실의 개인 공간 제공</p>  
                                </div>
                                <ul class="fture mgL_20">
                                    <li>대학원 외국인 유학생을 위한 Study in Korea 프로그램</li>
                                </ul>
                                <div class="li_title">
                                    <p class="li_s mgL_50 mgB_8">대학 특별 장학금 지원</p>
                                    <p class="li_s mgL_50 mgB_8">우수 자비유학생 장학 지원</p>
                                    <p class="li_s mgL_50 mgB_8">재단 및 기업 장학금 지원</p>
                                    <p class="li_s mgL_50 mgB_8">Global Korea Scholarship 지원</p>
                                    <p class="li_s mgL_50 mgB_8">외국인유학생 기숙사 지원(부울경 최소비용)</p>
                                </div>
                            </>:null}  */} 
                            
                            {/*(석사)스마트융합공학부-교과과정   
                            {menuCd ==125 ?<>
                            <div class="li_title">
                                <p class="title mgB_18">스마트융합공학부 석사과정 교육과정표</p>
                                <div class="is-wauto-box mgB_60">
                                <table class="content_table of_n">
                                <colgroup>
                                    <col width="8%"></col>
                                    <col width="auto"></col>
                                    <col width="6%"></col>
                                    <col width="8%"></col>
                                    <col width="1%"></col>
                                    <col width="8%"></col>
                                    <col width="auto"></col>
                                    <col width="6%"></col>
                                    <col width="8%"></col>
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>구분</th>
                                        <th>교과목명</th>
                                        <th>학점</th>
                                        <th class="borR_none">비고</th>
                                        <th class="none"></th>
                                        <th>구분</th>
                                        <th>교과목명</th>
                                        <th>학점</th>
                                        <th>비고</th>
                                    </tr>
                                </thead>                                
                                    <tbody>
                                    <tr>
                                        <td>논문</td>
                                        <td>석사논문연구지도</td>
                                        <td>2</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        한국어공학논문작성특론2
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>논문</td>
                                        <td>석사학위청구논문</td>
                                        <td>2</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>현장실무1</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>스마트융합공학세미나1</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>현장연구1</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>스마트융합공학세미나2</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>현장실무2</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>과학논문작성및프리젠테이션</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>현장연구2</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>CAE특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>영어논문작성및영어학술발표</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>공간정보체계특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>전산응용수치해석</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>전기안전특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>전기화재특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>전기기계설계특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>화재피난시뮬레이션특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>위험물질특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>도시방재특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>소방관계법특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>열전달특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>유체역학특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>화재역학특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>열역학특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>화재위험성평가특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>연소공학특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>제연시스템특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>소방기계설비특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>방화공학특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>소방설계및시공특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>건축방재계획특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>성능위주설계특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>재난안전공학특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>건축재료및구조특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>열화상분석특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>계측공학특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>항공우주공학특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>미분방정식특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>전자유체특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>고체역학특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>CAD/CAM특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>운영체제특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>재료과학특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>인공지능특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>항공역학특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>시스템스토리지특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>전산유체특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>알고리즘설계및분석</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>임베디드운영체제</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>컴퓨터네트워크특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>그래프이론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>멀티미디어시스템특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>기계학습특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>시스템프로그래밍특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>데이터베이스특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>모바일임베디드시스템</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>컴퓨터망특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>IoT임베디드소프트웨어</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>무선네트워크특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>임베디드클라우드엣지컴퓨팅</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>모바일프로그래밍특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>분산시스템</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>유비쿼터스컴퓨팅특론&nbsp;</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>화재모델링특론</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>컴퓨터보안</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>한국어공학논문작성특론1</td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>빅데이터분석특론</td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            </div>                              
                            </>:null}*/}

                            {/*(석사)글로벌비즈니스학과-학과소개 
                            {menuCd == 127 ?<>                           
                            <div class="li_title">
                                <p class="title mgB_12">소개</p>
                                <p class="title_s mgB_30 mgL_10">창신대학교 일반대학원 글로벌비즈니스 학과는 글로벌 환경에 맞는 융·복합 사고력과 전문성을 겸비하여 글로벌 비즈니스 환경에서 성공적으로 활동할 수 있도록 지식과 기술을 함양한 전문가를 양성하는 학과로서, 비즈니스 전공지식과 더불어 다양한 문화적 소양 학습을 통하여 글로벌 인재를 양성하고자 합니다</p>
                                <p class="li mgB_12 txtst">글로벌비즈니스 전공</p>
                                <p class="mgL_40 mgB_120">글로벌비즈니스 전공은 글로벌 시대에 부응하는 국제적 감각, 전문성, 도덕성을 겸비한 글로벌 비즈니스 인재양성을 교과과정으로 하며, 재학기간 동안 다양한 외국어 및 한국어 강의를 통해 글로벌 비즈니스에 대한 전문지식 습득을 목표로 합니다.</p>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_18">비전 및 교육목표</p>
                                <div class="vision under mgB_80">
                                    <p class="label"></p> 
                                    <ul>
                                        <li>글로벌 비즈니스 리더의 요람, 혁신과 창의성을 기반으로 세상을 변화시키는 리더 양성!</li>
                                    </ul>
                                </div>
                                <div class="edu mgB_120">
                                    <p class="label"></p>                                    
                                    <ul>
                                        <li><div class="num">01.</div><div>글로벌 리더십을 갖춘 혁신적 비즈니스 전문가 양성</div></li>
                                        <li><div class="num">02.</div><div>글로벌 역량강화, 혁신과 창의성, 윤리와 사회적 책임, 실무중심의 교육, 연구와 학문기여, 글로벌 네트워크 구축</div></li>
                                        <li><div class="num">02.</div><div>글로벌 비즈니스 리더로 성장할 수 있도록 다각적인 지원 및 교육</div></li>

                                    </ul>
                                </div>
                            </div>
                            </>:null}   */}    
                            
                            {/*(석사)글로벌비즈니스학과-교과과정                
                            {menuCd ==129 ?<>  
                            <div class="li_title">
                                <p class="title mgB_18">글로벌비즈니스학과 석사과정 교육과정표</p>
                                <div class="is-wauto-box mgB_60">
                                <table class="content_table of_n">
                                <colgroup>
                                    <col width="8%"></col>
                                    <col width="auto"></col>
                                    <col width="6%"></col>
                                    <col width="8%"></col>
                                    <col width="1%"></col>
                                    <col width="8%"></col>
                                    <col width="auto"></col>
                                    <col width="6%"></col>
                                    <col width="8%"></col>
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>구분</th>
                                        <th>교과목명</th>
                                        <th>학점</th>
                                        <th class="borR_none">비고</th>
                                        <th class="none"></th>
                                        <th>구분</th>
                                        <th>교과목명</th>
                                        <th>학점</th>
                                        <th>비고</th>
                                    </tr>
                                </thead>                                
                                <tbody>
                                <tr>
                                    <td>선택</td>
                                    <td>경영통계학이론과실제</td>
                                    <td>3</td>
                                    <td class="borR_none"></td>
                                    <td class="none"></td>
                                    <td>선택</td>
                                    <td>4차산업혁명과경영연구</td>
                                    <td>3</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>선택</td>
                                    <td>글로벌마케팅리서치</td>
                                    <td>3</td>
                                    <td class="borR_none"></td>
                                    <td class="none"></td>
                                    <td>선택</td>
                                    <td>글로벌경제환경연구</td>
                                    <td>3</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>선택</td>
                                    <td>글로벌이슈세미나</td>
                                    <td>3</td>
                                    <td class="borR_none"></td>
                                    <td class="none"></td>
                                    <td>선택</td>
                                    <td>글로벌브랜드연구</td>
                                    <td>3</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>선택</td>
                                    <td>한중비즈니스연구</td>
                                    <td>3</td>
                                    <td class="borR_none"></td>
                                    <td class="none"></td>
                                    <td>선택</td>
                                    <td>글로벌스타트업세미나</td>
                                    <td>3</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>선택</td>
                                    <td>글로벌파이낸스연구</td>
                                    <td>3</td>
                                    <td class="borR_none"></td>
                                    <td class="none"></td>
                                    <td>선택</td>
                                    <td>기업과문화연구</td>
                                    <td>3</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>선택</td>
                                    <td>글로벌증권관리연구</td>
                                    <td>3</td>
                                    <td class="borR_none"></td>
                                    <td class="none"></td>
                                    <td>선택</td>
                                    <td>글로벌언어와사회문화연구</td>
                                    <td>3</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>선택</td>
                                    <td>글로벌리더십연구</td>
                                    <td>3</td>
                                    <td class="borR_none"></td>
                                    <td class="none"></td>
                                    <td>선택</td>
                                    <td>K-컬처연구</td>
                                    <td>3</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>선택</td>
                                    <td>연구조사방법론</td>
                                    <td>3</td>
                                    <td class="borR_none"></td>
                                    <td class="none"></td>
                                    <td>선택</td>
                                    <td>글로벌관광개발연구</td>
                                    <td>3</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>선택</td>
                                    <td>글로벌경영세미나</td>
                                    <td>3</td>
                                    <td class="borR_none"></td>
                                    <td class="none"></td>
                                    <td>선택</td>
                                    <td>글로벌경영사례연구</td>
                                    <td>3</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>선택</td>
                                    <td>글로벌사회와경제</td>
                                    <td>3</td>
                                    <td class="borR_none"></td>
                                    <td class="none"></td>
                                    <td>선택</td>
                                    <td>서비스마케팅분석</td>
                                    <td>3</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>선택</td>
                                    <td>디지털문화콘텐츠연구</td>
                                    <td>3</td>
                                    <td class="borR_none"></td>
                                    <td class="none"></td>
                                    <td>선택</td>
                                    <td>다문화의사소통연구</td>
                                    <td>3</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>선택</td>
                                    <td>인문학마케팅</td>
                                    <td>3</td>
                                    <td class="borR_none"></td>
                                    <td class="none"></td>
                                    <td>선택</td>
                                    <td>호스피탈리티산업분석</td>
                                    <td>3</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>선택</td>
                                    <td>글로벌비즈니스커뮤니케이션전략</td>
                                    <td>3</td>
                                    <td class="borR_none"></td>
                                    <td class="none"></td>
                                    <td>선택</td>
                                    <td>언어문화와경영학</td>
                                    <td>3</td>
                                    <td></td>
                                </tr>
                                </tbody>
                                </table>
                            </div>
                            </div>                              
                            </>:null}*/}   

                            
                            {/*특수-사회복지학과-학과소개 
                            {menuCd ==131 ?<>                            
                            <div class="li_title">
                                <p class="title mgB_12">소개</p>
                                <p class="title_s mgB_120 mgL_10">창신대학교 복지문화대학원(특수대학원) 사회복지학과는 2017학년도 신설된 젊은 대학원입니다. 특화된 교육과정 및 교육내용을 기반으로 현장중심 사회복지이론과 실제를 학습하고 실천을 고민하며, 현장에서 필요로 하는 전문 지식을 개발하고 연구함으로써 지역사회에서 환영받는 실천형 연구자 양성을 목표로 하고 있습니다.</p>
                           </div>
                           <div class="li_title">
                                <p class="title mgB_18">비전 및 교육목표</p>
                                <div class="vision under mgB_80">
                                    <p class="label"></p> 
                                    <ul>
                                        <li>Professional Global Leader for Universal Social Welfare</li>
                                    </ul>
                                </div>
                                <div class="edu mgB_120">
                                    <p class="label"></p>                                    
                                    <ul>
                                        <li><div class="num">01.</div><div>복지사회를 지향하는 비전제시형 사회복지지도자 양성</div></li>
                                        <li><div class="num">02.</div><div>지역사회에 필요한 정책·제도자문형 전문 사회복지인 양성</div></li>
                                        <li><div class="num">03.</div><div>변화하는 사회에 적합한 현장밀착형 전문 사회복지인 양성</div></li>
                                        <li><div class="num">04.</div><div>학문적 소양과 인격적 소양을 두루 갖춘 균형감 있는 사회복지인 양성</div></li>
                                        <li><div class="num">05.</div><div>글로컬 사회변화 적응에 유연성을 가진 사회복지전문가 양성</div></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_24">사회복지학과 특징</p>
                                <p class="li no_m mgB_12">맞춤형 트랙 교육과정</p>
                                <ul class="fture mgL_20 mgB_30">
                                    <li>사회복지사 자격증 유무에 따른 운영 : 전공자과정 - 비전공자과정</li>
                                    <li>현장 실무종사자의 역할에 따른 운영 : 일선종사자 - 중간관리자 - 최고관리자</li>
                                </ul>
                                <p class="li no_m mgB_12">사회복지 실천현장에 필요한 실천 연구자를 양성하는 대학원</p>
                                <ul class="fture mgL_20 mgB_30">
                                    <li>사회복지실천 프로그램 개발 및 평가 교육과정 운영</li>
                                    <li>실천평가를 위한 척도개발 및 분석 전문인 양성과정</li>
                                    <li>지역참여형 교과과정 전면 개편 및 운영</li>
                                    <li>매년 논문작성 및 연구방법 세미나 운영</li>
                                    <li>전국 전문가를 잇는 경남사회복지 오픈세미나 운영</li>
                                </ul>
                                <p class="li no_m">논문학위과정(4학기) & 비논문학위과정(5학기) 선택</p>
                            </div>
                            </>:null}*/}
                            
                            {/*특수-사회복지학과-교육과정 
                            {menuCd ==133 ?<>
                            <div class="li_title">
                                <p class="title mgB_18">교과과정</p>
                                <p class="li mgB_8">운영</p>
                                <p class="li_s mgL_40 mgB_8">수업연한 : 논문학위자 2년 (4차 학기) / 비논문학위자 2년 6개월 (5차 학기)</p>
                                <p class="li_s mgL_40 mgB_8">자격증 : 사회복지사 2급 취득 (최소 8과목(필수 6과목+선택2과목)이상 이수)</p>
                                <p class="li_s mgL_40 mgB_8">학 위 : 사회복지학 석사학위 [수강생의 선택에 따라 (1) 학위논문 학위과정 (2) 무논문 학위과정 운영]</p>
                                <p class="li_s mgL_40 mgB_8">수료학점 : 24학점 이상 취득</p>
                                <p class="li_s mgL_40 mgB_8">이수학점</p>
                                <p class="li_s mgL_50 mgB_8">학위논문 : 4차 학기 ‘논문연구(3학점)’ 수강 / 논문연구는 졸업학점에 미포함</p>
                                <p class="li_s mgL_50 mgB_18">학위시험 : 5차 학기 ‘전공선택(6학점)’ 수강</p>
                                <div class="is-wauto-box wid_95 mgB_30">
                                    <table class="content_table">
                                    <colgroup>
                                        <col width="11%"></col>
                                        <col width="11%"></col>
                                        <col width="11%"></col>
                                        <col width="11%"></col>
                                        <col width="11%"></col>
                                        
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>소속</th>
                                            <th>학위</th>
                                            <th>모집정원</th>
                                            <th>수업연한</th>
                                            <th>비고</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td rowspan="2">부동산경영학과</td>
                                            <td>부동산학 박사</td>
                                            <td rowspan="2">00명</td>
                                            <td rowspan="2"><p>2년</p>(4학기)</td>
                                            <td rowspan="2">주간</td>
                                        </tr>
                                        <tr>
                                            <td class="borR">경영학 박사</td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div>
                                <p class="li mgB_8">편성 교과목</p>
                                <p class="li_s mgL_40 mgB_8">기본교육 : 한국사회복지사협회의 사회복지사자격증 취득을 위한 이수과목을 중심 편성</p>
                                <p class="li_s mgL_40 mgB_8">심화교육 : 다양한 사회복지현장에 맞는 사회복지 교과목 개발 및 현장중심 과목 편성</p>
                                <p class="li_s mgL_40 mgB_80">전문교육 : 전공자의 세부연구 및 실천분야에 적합한 교과목 편성</p>
                                

                            </div> 
                            <div class="li_title">
                                <p class="title mgB_18">사회복지학과 석사과정 교육과정표</p>
                                <p class="notitxt mgB_18"><span class="txt">사회복지사 자격증 : ⭘ - 필수과목 /  ▲ - 선택과목</span></p>
                            <div class="is-wauto-box mgB_60">
                                <table class="content_table of_n">
                                <colgroup>
                                    <col width="8%"></col>
                                    <col width="auto"></col>
                                    <col width="6%"></col>
                                    <col width="8%"></col>
                                    <col width="1%"></col>
                                    <col width="8%"></col>
                                    <col width="auto"></col>
                                    <col width="6%"></col>
                                    <col width="8%"></col>
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>구분</th>
                                        <th>교과목명</th>
                                        <th>학점</th>
                                        <th class="borR_none">비고</th>
                                        <th class="none"></th>
                                        <th>구분</th>
                                        <th>교과목명</th>
                                        <th>학점</th>
                                        <th>비고</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>논문</td>
                                        <td>석사논문연구지도</td>
                                        <td>2</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        복지국가와고전연구
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>논문</td>
                                        <td>
                                        석사학위청구논문
                                        </td>
                                        <td>2</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        사회복지행정론
                                        </td>
                                        <td>3</td>
                                        <td>⭘</td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>
                                        인간행동과 사회환경
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none">⭘</td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        사회복지정책론
                                        </td>
                                        <td>3</td>
                                        <td>⭘</td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>
                                        사회복지실천론
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none">⭘</td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        사회복지자료분석론
                                        </td>
                                        <td>3</td>
                                        <td>▲</td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>
                                        사회복지조사론
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none">⭘</td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        사회복지세미나Ⅱ
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>
                                        사회복지현장실습
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none">⭘</td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        정신건강사회복지론
                                        </td>
                                        <td>3</td>
                                        <td>▲</td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>
                                        사회복지세미나Ⅰ
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        아동복지론
                                        </td>
                                        <td>3</td>
                                        <td>▲</td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>
                                        임상사회사업론
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        청소년복지론
                                        </td>
                                        <td>3</td>
                                        <td>▲</td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>
                                        사례관리론
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none">▲</td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        장애인복지론
                                        </td>
                                        <td>3</td>
                                        <td>▲</td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>
                                        노인복지론
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none">▲</td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        프로그램개발과 평가
                                        </td>
                                        <td>3</td>
                                        <td>▲</td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>
                                        가족복지론
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none">▲</td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        휴먼서비스론
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>
                                        고급사회복지행정
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        사회복지제도와 정치
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>
                                        휴먼서비스조직론
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none"></td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        복지국가와사회적경제
                                        </td>
                                        <td>3</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>
                                        사회보장론
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none">▲</td>
                                        <td class="none"></td>
                                        <td>선택</td>
                                        <td>
                                        사회복지법제와실천
                                        </td>
                                        <td>3</td>
                                        <td>⭘</td>
                                    </tr>
                                    <tr>
                                        <td>선택</td>
                                        <td>
                                        지역사회복지론
                                        </td>
                                        <td>3</td>
                                        <td class="borR_none">⭘</td>
                                        <td class="none"></td>
                                        <td class="none"></td>
                                        <td class="none"></td>
                                        <td class="none"></td>
                                        <td class="none"></td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            </div>                             
                            </>:null}*/}

                            {/*(특수)미용예술학과-학과소개 
                            {menuCd ==135 ?<>                           
                            <div class="li_title">
                                <p class="title mgB_12">소개</p>
                                <p class="title_s mgB_120 mgL_10">창신대학교 미용예술학과는 경상남도 유일의 4년제 미용관련 학부 및 대학원으로 연구역량을 겸비한 학문적인 리더, 뷰티아트 창의력을 겸비한 예술적인 리더를 양성하여 새로운 뷰티 트렌드를 창출·확산하고 미용산업 및 미용문화 발전에 기여하는 것을 목표로 한다.</p>
                           </div>
                           <div class="li_title">
                                <p class="title mgB_18">비전 및 교육목표</p>
                                <div class="vision under mgB_80">
                                    <p class="label"></p> 
                                    <ul>
                                        <li>Creative Professionals Leading the Beauty Trend</li>
                                    </ul>
                                </div>
                                <div class="edu mgB_120">
                                    <p class="label"></p>                                    
                                    <ul>
                                        <li><div class="num">01.</div><div>관련 학문과 융합, 연계하여 사회변화에 유연하게 대처할 수 있는 미래형 리더 양성</div></li>
                                        <li><div class="num">02.</div><div>분석적 사고와 문제해결 능력을 갖추고 학문적 성과를 현장에 접목할 수 있는 경영자 양성</div></li>
                                        <li><div class="num">03.</div><div>융합적, 창의적 사고를 바탕으로 프로젝트를 기획 및 수행할 수 있는 뷰티디렉터 양성</div></li>
                                        <li><div class="num">04.</div><div>국내외 미용정책과 트렌드에 신속하게 대응할 수 있는 감각과 기술을 갖춘 글로벌 인재 양성</div></li>
                                        <li><div class="num">05.</div><div>명장, 기능장, 우수 숙련자 등 엘리트 미용전문가 양성</div></li>
                                        <li><div class="num">06.</div><div>빠르게 변화하는 교육환경에 주도적으로 대처하는 미용교육 전문가 양성</div></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_24">미용예술학과과 특징</p>
                                <p class="li no_m mgB_18">수업방법</p>
                                <ul class="fture mgL_20">
                                    <li>분석적 사고와 체계적 연구수행 능력 개발 중심의 논문 트랙 개설</li>
                                    <li>창의적 디자인 감각 향상과 미학적 탐색 중심의 뷰티아트 트랙 개설</li>
                                    <li>미용관련 세부전공(네일, 메이크업, 피부, 헤어, 교육기관, 향장업 등)의 특성을 고려한 공통, 선택과목의 개설</li>
                                    <li>일본, 대만, 중국 등 해외 교류대학과의 세미나 개최로 글로벌 정보 교류</li>
                                    <li>산업체 근무와 병행 가능한 야간수업 진행</li>
                                    <li>미용 중앙회, 협회 기관과의 수업 교류를 통한 최신트렌드 교육</li>
                                    <li>스타강사 및 국가대표 초청 특강으로 실기교육방법 및 인적교류 확대</li>
                                </ul>
                            </div>
                            </>:null}*/} 

                            {/*(특수)미용예술학과-교과과정 
                            {menuCd ==137 ?<>
                            <div class="li_title">   
                            <p class="title mgB_12">미용예술학과 석사과정 교육과정표</p>
                                <div class="is-wauto-box mgB_60">
                                    <table class="content_table of_n">
                                    <colgroup>
                                        <col width="8%"></col>
                                        <col width="auto"></col>
                                        <col width="6%"></col>
                                        <col width="8%"></col>
                                        <col width="1%"></col>
                                        <col width="8%"></col>
                                        <col width="auto"></col>
                                        <col width="6%"></col>
                                        <col width="8%"></col>
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>구분</th>
                                            <th>교과목명</th>
                                            <th>학점</th>
                                            <th class="borR_none">비고</th>
                                            <th class="none"></th>
                                            <th>구분</th>
                                            <th>교과목명</th>
                                            <th>학점</th>
                                            <th>비고</th>
                                        </tr>
                                    </thead>
                                    <tbody>      
                                        <tr>
                                            <td>논문</td>
                                            <td>석사논문연구지도</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>논문연구방법론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>논문</td>
                                            <td>석사학위청구논문</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>경영관리특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>미용문화사</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>건강의학특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>화장품학연구</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>피부학연구</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>미용세미나</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>미용연구방법론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>향장문화산업론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>고객관리와커뮤니케이션</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>색채학특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>뷰티비즈니스론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>미용산업연구</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>트렌드연구</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>작품디자인론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>뷰티테라피연구</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>졸업작품세미나</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>뷰티문화콘텐츠</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>뷰티마케팅연구</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>뷰티아트워크</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>미용교수법연구</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>모발및두피관리연구</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>해부생리학특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>메이크업분석론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>미용보건세미나</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>빅데이터분석론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>헤어스타일조형연구</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>고령사회뷰티서비스론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>디지털뷰티산업</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>인공지능과뷰티콘텐츠</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>미용통계학</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td class="none"></td>
                                            <td class="none"></td>
                                            <td class="none"></td>
                                            <td class="none"></td>
                                        </tr>
                                        </tbody>
  
                                    
                                    </table>
                                </div>    
                            </div>
                            </>:null}*/} 
                            
                            {/*(특수)음악학과-학과소개     
                            {menuCd ==139 ?<>                        
                            <div class="li_title">
                                <p class="title mgB_12">소개</p>
                                <p class="title_s mgB_120 mgL_10">음악대학원은 우리 대학의 인재상인 「봉사의 윤리인, 창의적 전문인, 진취적 세계인」에 맞추어 2019학년도에 신설된 대학원이다. 이론분야의 심도 깊은 학문연구와 연주자의 실기능력 향상에 특화된 커리큘럼으로 빠르게 변화되는 음악교육현장에 바로 적용하며, 나아가 지역사회에 봉사하며 창의적이고 세계적인 안목을 갖춘 전문연주자 양성을 목표로 한다</p>
                           </div>
                           <div class="li_title">
                                <p class="title mgB_18">비전 및 교육목표</p>
                                <div class="vision under mgB_80">
                                    <p class="label"></p> 
                                    <ul>
                                        <li>Academic Professional and Creative Musician</li>
                                    </ul>
                                </div>
                                <div class="edu mgB_120">
                                    <p class="label"></p>                                    
                                    <ul>
                                        <li><div class="num">01.</div><div>지역사회에 필요한 전문적 음악인 양성</div></li>
                                        <li><div class="num">02.</div><div>이론과 지식이 겸비된 학문적 음악인 양성</div></li>
                                        <li><div class="num">03.</div><div>빠르게 변화하는 음악시장에 적합한 창의적 음악인 양성</div></li>
                                        <li><div class="num">04.</div><div>다양한 음악관련 직종에 준비된 융합역량적 음악인 양성</div></li>
                                        <li><div class="num">05.</div><div>새로운 음악교육 패러다임을 선도할 지도자적 음악인 양성</div></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_24">음악학과 특징</p>
                                <ul class="fture mgL_20">
                                    <li>논문트랙과 연주트랙을 분리하여 개인의 학업목표에 유연적 적용 가능</li>
                                    <li>대학원 전용 연습실 및 그랜드피아노를 마련하여 최상의 교육환경 마련</li>
                                    <li>개인 연주력 향상을 위한 국·내외 다양한 연주경험 시스템 마련</li>
                                    <li>직장과 병행 가능한 야간수업 진행</li>
                                    <li>음악학과 특성화 사업관련 전문연주자 초청 특강 및 연주에 참여</li>
                                    <li>교수와 학생간의 1:1 멘토제를 통하여 교과과정 및 다양한 분야의 상담가능</li>
                                    <li>해외 명문 연계 대학과의 연수 프로그램</li>
                                </ul>
                            </div>
                            </>:null}*/}

                            {/*(특수)음악학과-교과과정 
                            {menuCd ==141 ?<>
                            <div class="li_title">   
                                <p class="title mgB_24">음악학과 석사과정 교육과정표</p>
                                <div class="notitxt mgB_18">
                                    <p class="mgB_4 txt"> ▲ - 비논문트랙 / ○ - 논문트랙</p></div>
                                <div class="is-wauto-box mgB_60">
                                    <table class="content_table of_n">
                                    <colgroup>
                                        <col width="8%"></col>
                                        <col width="auto"></col>
                                        <col width="6%"></col>
                                        <col width="8%"></col>
                                        <col width="1%"></col>
                                        <col width="8%"></col>
                                        <col width="auto"></col>
                                        <col width="6%"></col>
                                        <col width="8%"></col>
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>구분</th>
                                            <th>교과목명</th>
                                            <th>학점</th>
                                            <th class="borR_none">비고</th>
                                            <th class="none"></th>
                                            <th>구분</th>
                                            <th>교과목명</th>
                                            <th>학점</th>
                                            <th>비고</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>필수</td>
                                            <td>고급전공1</td>
                                            <td>1</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>고급뮤직프로덕션2</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>필수</td>
                                            <td>고급전공2</td>
                                            <td>1</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>고급음원제작1</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>필수</td>
                                            <td>고급전공3</td>
                                            <td>1</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>고급음원제작2</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>필수</td>
                                            <td>고급전공4</td>
                                            <td>1</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>뮤직비즈니스</td>
                                            <td>2</td>
                                            <td>▲</td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>고급전공5</td>
                                            <td>1</td>
                                            <td class="borR_none">▲</td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>고급재즈화성학</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>고급반주법1</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>건반화성</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>고급반주법2</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>음악미학</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>고급뮤직퍼포먼스1</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>연주법세미나</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>고급뮤직퍼포먼스2</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>고급음악이론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>졸업연주세미나</td>
                                            <td>3</td>
                                            <td class="borR_none">▲</td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>교수법세미나</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>고급음악문헌</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>음악과창의</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>서양음악사</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>논문</td>
                                            <td>석사논문연구지도</td>
                                            <td>2</td>
                                            <td>○</td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>음악분석</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>논문</td>
                                            <td>석사학위청구논문</td>
                                            <td>2</td>
                                            <td>○</td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>고급뮤직프로덕션1</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td class="none"></td>
                                            <td class="none"></td>
                                            <td class="none"></td>
                                            <td class="none"></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>    
                            </div>                
                            </>:null}*/} 
                            
                            {/*(특수)유아교육과-학과소개    
                            {menuCd ==143 ?<>                         
                            <div class="li_title">
                                <p class="title mgB_12">소개</p>
                                <p class="title_s mgB_100 mgL_10">창신대학교 복지문화대학원 유아교육학과는 미래사회에 필요한 교육역량을 갖춘 유아교육전문가를 양성하기 위해 2020학년도에 신설되며 이론과 실천이 연계 될 수 있는 유아교사들의 전문적인 배움의 장이 되고자 합니다. 4차 산업시대에 발맞추어 미래 유아교사가 갖추어야 할 역량을 기르기 위해 이론 분야의 깊이 있는 학문연구와 더불어 유아교육현장의 다양한 문제를 해결하기 위한 현장실무중심의 교육과정을 운영하여 실천적 능력을 갖춘 유아교육전문가를 양성하고자 합니다.</p>
                           </div>
                           <div class="li_title">
                                <p class="title mgB_18">비전 및 교육목표</p>
                                <div class="vision under mgB_80">
                                    <p class="label"></p> 
                                    <ul>
                                        <li>Academic and Field Competency-Based Education Professional</li>
                                    </ul>
                                </div>
                                <div class="edu mgB_120">
                                    <p class="label"></p>                                    
                                    <ul>
                                        <li><div class="num">01.</div><div>지역사회와 함께 성장하는 교육공동체적 유아교육전문가 양성</div></li>
                                        <li><div class="num">02.</div><div>급변하는 사회에 적합한 현장실무역량형 유아교육전문가 양성</div></li>
                                        <li><div class="num">03.</div><div>인문학적 소양과 인성적 소양을 갖춘 섬김의 유아교육전문가 양성</div></li>
                                        <li><div class="num">04.</div><div>다양한 학문과의 융합을 선도하는 창의적 유아교육전문가 양성</div></li>
                                        <li><div class="num">05.</div><div>새로운 교육패러다임 적응에 유연성을 가진 유아교육전문가 양성</div></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_24">유아교육학과 특징</p>
                                <p class="li no_m mgB_12">특화된 교육</p>
                                <ul class="fture mgL_20 mgB_30">
                                    <li>논문연구 지도교수제를 통한 대학원 4학기 내 석사학위취득 지원</li>
                                    <li>맞춤형 교육과정 운영하여 논문트랙과 비논문트랙을 선택</li>
                                    <li>직장과 병행 가능한 야간 수업 진행</li>
                                    <li>아동상담 분야를 특화한 교육과정 운영과 풍부한 현장 경력을 갖춘 전임교수 확보</li>
                                </ul>
                                <p class="li no_m mgB_12">장학특전</p>
                                <ul class="fture mgL_20 mgB_30">
                                    <li>수업료 50% 감면</li>
                                    <li>입학금 면제</li>
                                </ul>
                                <p class="li no_m mgB_12">특성화 전략</p>
                                <ul class="fture mgL_20">
                                    <li>유아교육현장의 전문성 요구에 부응하는 교육과정 개발 및 운영</li>
                                    <li>대학 내 유아교육연구소와 연계된 다양한 학술발표 및 세미나 참가</li>
                                    <li>유아문제행동지도를 전문적으로 할 수 있는 자격증 관련 학회와 연계된 프로그램 운영</li>
                                    <li>외국대학과의 협약을 통한 학술 교류 및 연수 참가</li>
                                </ul>
                            </div>
                            </>:null}*/}
                            
                            {/*(특수)유아교육과-교과과정
                            {menuCd ==145 ?<>
                            <div class="li_title">   
                            <p class="title mgB_12">유아교육학과 석사과정 교육과정표</p>
                                <div class="is-wauto-box mgB_60">
                                    <table class="content_table of_n">
                                    <colgroup>
                                        <col width="8%"></col>
                                        <col width="auto"></col>
                                        <col width="6%"></col>
                                        <col width="8%"></col>
                                        <col width="1%"></col>
                                        <col width="8%"></col>
                                        <col width="auto"></col>
                                        <col width="6%"></col>
                                        <col width="8%"></col>
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>구분</th>
                                            <th>교과목명</th>
                                            <th>학점</th>
                                            <th class="borR_none">비고</th>
                                            <th class="none"></th>
                                            <th>구분</th>
                                            <th>교과목명</th>
                                            <th>학점</th>
                                            <th>비고</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>논문</td>
                                            <td>석사논문연구지도</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>생태유아교육세미나</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>논문</td>
                                            <td>석사학위청구논문</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>유아연구방법론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>유아교사교육특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>유아교수법연구</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>영유아문제행동지도실제</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>유아교육과정세미나</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>유아놀이이론과실제</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>질적연구세미나</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부모교육및상담</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>비교유아교육연구</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>유아교육기관운영관리세미나</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>유아교육현장연구</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>유아교육동향세미나</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>유아교육프로그램연구</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>유아교육기초통계</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>아동상담기법과실제</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>인성교육의이론과실제</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>특수교구교재제작</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>특수아상담및가족지원</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td class="none"></td>
                                            <td class="none"></td>
                                            <td class="none"></td>
                                            <td class="none"></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>    
                            </div>
                            </>:null}*/} 
                            
                            {/*(특수)식품영양학과-학과소개   
                            {menuCd ==147 ?<>                          
                            <div class="li_title">
                                <p class="title mgB_12">소개</p>
                                <p class="title_s mgB_120 mgL_10">복지문화대학원 식품영양학과 식품산업학 석사과정에서는 적문적이고 체계적인 현장 중심 커리큘럼 운영을 통해 식품산업 발전을 선두하고, 새로운 식품 및 외식 트렌드를 창출 할 수 있는 창의적 인재 양성을 목표로 한다.</p>
                           </div>
                           <div class="li_title">
                                <p class="title mgB_18">비전 및 교육목표</p>
                                <div class="vision under mgB_80">
                                    <p class="label"></p> 
                                    <ul>
                                        <li>Professional and creative food industry characterization</li>
                                    </ul>
                                </div>
                                <div class="edu mgB_120">
                                    <p class="label"></p>                                    
                                    <ul>
                                        <li><div class="num">01.</div><div>분석적인 사고와 문제해결능력을 갖춘 현장 식품전문가 양성</div></li>
                                        <li><div class="num">02.</div><div>융합적, 창의적 사고를 바탕으로 한 식품 및 외식 선도주자 양성</div></li>
                                        <li><div class="num">03.</div><div>국내·외 식품산업 정책에 유연하게 대응하는 글로벌 인재 양성</div></li>
                                        <li><div class="num">04.</div><div>외식 창업 및 경영 전문가 양성</div></li>
                                        <li><div class="num">05.</div><div>현장 중심의 식품교육 전문가 양성</div></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_24">식품영양학과 특징</p>
                                <ul class="fture mgL_40">
                                    <li>수업료 50% 감면/그 외 장학혜택/입학금 전액 감면</li>
                                    <li>실납부액 : 1,750,000원(1학기분)</li>
                                    <li style={{marginBottom:"12px"}}>특화된 운영체계</li>
                                </ul>
                                <div class="li_title">
                                    <p class="li_s mgL_70 mgB_8">개인의 학습목표에 따른 논문과정과 비논문과정 분리 운영</p>
                                    <p class="li_s mgL_70 mgB_8">개인의 관심분야 역량강화를 위한 다양한 학습경험 제공</p>
                                    <p class="li_s mgL_70 mgB_8">교수와 학생 간의 1:1 멘토제 운영</p>
                                    <p class="li_s mgL_70 mgB_8">산, 학, 연 연계 프로젝트 수행</p>
                                    <p class="li_s mgL_70 mgB_8">직장과 병행한 야간수업 진행</p>
                                </div>
                            </div>
                            </>:null}*/}
                            
                            {/*(특수)식품영양학과-교과과정 
                            {menuCd ==149 ?<> 
                            <div class="li_title">   
                            <p class="title mgB_12">식품영양학과 석사과정 교육과정표</p>
                                <div class="is-wauto-box mgB_60">
                                    <table class="content_table of_n">
                                    <colgroup>
                                        <col width="8%"></col>
                                        <col width="auto"></col>
                                        <col width="6%"></col>
                                        <col width="8%"></col>
                                        <col width="1%"></col>
                                        <col width="8%"></col>
                                        <col width="auto"></col>
                                        <col width="6%"></col>
                                        <col width="8%"></col>
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>구분</th>
                                            <th>교과목명</th>
                                            <th>학점</th>
                                            <th class="borR_none">비고</th>
                                            <th class="none"></th>
                                            <th>구분</th>
                                            <th>교과목명</th>
                                            <th>학점</th>
                                            <th>비고</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>논문</td>
                                            <td>석사논문연구지도</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>생애맞춤형영양관리전략</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>논문</td>
                                            <td>석사학위청구논문</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>식품위생안전관리론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>전통발효식품연구</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>식품산업세미나</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>음식미학</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>임상영양식품특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>건강기능식품특론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>맞춤형식품개발및분석특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>식품영양정책연구</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>식품산업마케팅전략연구</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>식품산업통계</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>글로벌식문화특론</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>식품영양연구설계방법론</td>
                                            <td>3</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>외식창업및프랜차이즈연구</td>
                                            <td>3</td>
                                            <td></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>    
                            </div>
                            </>:null}*/} 
                            
                            {/*(특수)부동산경영대학원_부동산학과-학과소개 
                            {menuCd ==151 ?<>                            
                            <div class="li_title">
                                <p class="title mgB_12">소개</p>
                                <p class="title_s mgB_24 mgL_10">창신대학교 부동산경영대학원은 융·복합 교육을 통해 창의력과 전문성을 갖춘 부동산 전문가를 양성하여 국가와 사회발전에 기여하는 경남 최고의 부동산경영대학원을 지향한다.</p>
                                <p class="li mgB_12 txtst">경남 최고의 부동산학 교육 및 연구허브 구축지향</p>
                                <p class="li_s mgL_40 mgB_8">부동산 산업의 종합적이고 체계적인 교육과 연구를 수행하는 부동산학 거점 대학</p>
                                <p class="li_s mgL_40 mgB_8">전문 지식과 국제적 안목을 갖춘 경남 대표적 부동산 교육 전문기관</p>
                                <p class="li_s mgL_40 mgB_40">학부와 부동산경영대학원의 연계 및 대학원생들의 연륜과 능력을 활용한 부동산 연구네트워크</p>
                                <p class="li mgB_12 txtst">체계적인 부동산 관련 연구 및 융·복합 심화 학습</p>
                                <p class="li_s mgL_40 mgB_8">부동산 실무중심주의 교육과정 운영</p>
                                <p class="li_s mgL_40 mgB_8">실용적 지식과 국제적 안목을 갖춘 글로벌 부동산 전문가 육성의 산실</p>
                                <p class="li_s mgL_40 mgB_100">부동산 자산운용 및 관리, 조사분석 및 평가, 개발 및 정책 등 분야별 특화 교육</p>
                           </div>
                           <div class="li_title">
                                <p class="title mgB_80">교육목표</p>
                                <div class="edu mgB_80">
                                    <p class="label"></p>                                    
                                    <ul>
                                        <li><div class="num">01.</div><div>부동산학의 이론형성과 건전한 부동산 신산업의 육성에 기여</div></li>
                                        <li><div class="num">02.</div><div>국가 및 지역사회에 봉사하는 창의적이고 진취적인 글로벌 부동산 전문가 양성</div></li>
                                    </ul>
                                </div>
                                <div class="img_1"><img src="/images/sub/content/general/fe.png"/></div>  
                            </div>
                            </>:null}*/}
                            
                            {/*(특수)부동산경영대학원_부동산학과-교과과정 
                            {menuCd ==153 ?<> 
                            <div class="li_title">   
                            <p class="title mgB_12">부동산경영대학원 석사과정 교육과정표</p>
                                <div class="is-wauto-box mgB_60">
                                    <table class="content_table of_n">
                                    <colgroup>
                                        <col width="8%"></col>
                                        <col width="auto"></col>
                                        <col width="6%"></col>
                                        <col width="8%"></col>
                                        <col width="1%"></col>
                                        <col width="8%"></col>
                                        <col width="auto"></col>
                                        <col width="6%"></col>
                                        <col width="8%"></col>
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>구분</th>
                                            <th>교과목명</th>
                                            <th>학점</th>
                                            <th class="borR_none">비고</th>
                                            <th class="none"></th>
                                            <th>구분</th>
                                            <th>교과목명</th>
                                            <th>학점</th>
                                            <th>비고</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>논문</td>
                                            <td>석사논문연구지도</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산공경매실무</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>논문</td>
                                            <td>석사학위청구논문</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>경영컨설팅</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산학세미나</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산조세론</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산공경매분석</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산관리론</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산공법</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산시장분석</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>경영정보학</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>소비자행동연구론</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산경제론</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산계량분석</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산마케팅</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산금융투자연습</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산투자사례분석</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산개발컨설팅</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>인사관리론</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>도시계획론</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산입지분석</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>중소기업경영론</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산사업기획론</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>도시재생이론과실무</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>감정평가이론과실무</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>관광산업입지및개발</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>재건축 · 재개발이론과실무</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산프로젝트관리</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>창업실무세미나</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산중개이론및실무</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산빅데이터분석</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>공간정보체계론</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>시장조사방법론</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>국토및지역정책세미나</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>금융자산관리이론및실무</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>전사적자원관리세미나</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산권리분석론</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>서비스경영사례분석</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>도시및지역관광개발론</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>서비스마케팅 세미나</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>도시및부동산</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>호스피탈리티전략세미나</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>경영학세미나</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>글로벌경영전략</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>문화관광상품개발론</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>글로벌비즈니스커뮤니케이션</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>경영사례연구</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>연구조사방법론</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>관광개발인적자원관리론</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산사법2</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>인문학마케팅</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>프롭테크의 이해</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>글로벌사회와경제</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>재개발과 리모델링</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>자산투자세미나</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>해외부동산시장론</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산사법1</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>호스피탈리티 마케팅 연구</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>상업용 부동산 투자가치분석 실무</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산리조트자산운영연구</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>해외부동산이해</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>관광개발경제연구</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>자산시장론연구</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산리조트관리연구</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>마케팅조사분석연구</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>노사관계경영연구</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>민법및민사특별법</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>인간관계와 경영연구</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산정책세미나</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>휴양레저산업연구</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        </tbody>
                                    
                                    </table>
                                </div>    
                            </div>
                            </>:null}*/}  
                            
                            {/*(특수)부동산경영대학원_경영학과-학과소개  
                            {menuCd ==155 ?<>                        
                            <div class="li_title">
                                <p class="title mgB_12">소개</p>
                                <p class="title_s mgB_24 mgL_10">창신대학교 부동산경영대학원은 융·복합 교육을 통해 창의력과 전문성을 갖춘 부동산 전문가를 양성하여 국가와 사회발전에 기여하는 경남 최고의 부동산경영대학원을 지향한다.</p>
                                <p class="li mgB_12">경남 최고의 부동산학 교육 및 연구허브 구축지향</p>
                                <p class="li_s mgL_40 mgB_8">부동산 산업의 종합적이고 체계적인 교육과 연구를 수행하는 부동산학 거점 대학</p>
                                <p class="li_s mgL_40 mgB_8">전문 지식과 국제적 안목을 갖춘 경남 대표적 부동산 교육 전문기관</p>
                                <p class="li_s mgL_40 mgB_40">학부와 부동산경영대학원의 연계 및 대학원생들의 연륜과 능력을 활용한 부동산 연구네트워크</p>
                                <p class="li mgB_12">체계적인 부동산 관련 연구 및 융·복합 심화 학습</p>
                                <p class="li_s mgL_40 mgB_8">부동산 실무중심주의 교육과정 운영</p>
                                <p class="li_s mgL_40 mgB_8">실용적 지식과 국제적 안목을 갖춘 글로벌 부동산 전문가 육성의 산실</p>
                                <p class="li_s mgL_40 mgB_80">부동산 자산운용 및 관리, 조사분석 및 평가, 개발 및 정책 등 분야별 특화 교육</p>
                           </div>
                           <div class="li_title">
                                <p class="title mgB_80">교육목표</p>
                                <div class="edu mgB_80">
                                    <p class="label"></p>                                    
                                    <ul>
                                        <li><div class="num">01.</div><div>부동산학의 이론형성과 건전한 부동산 신산업의 육성에 기여</div></li>
                                        <li><div class="num">02.</div><div>국가 및 지역사회에 봉사하는 창의적이고 진취적인 글로벌 부동산 전문가 양성</div></li>
                                    </ul>
                                </div>
                                <div class="img_1"><img src="/images/sub/content/general/fe.png"/></div>  
                            </div>
                            </>:null}*/}  
                            
                            {/*(특수)부동산경영대학원_경영학과-교과과정 
                            {menuCd ==157 ?<>
                            <div class="li_title">   
                            <p class="title mgB_12">부동산경영대학원 석사과정 교육과정표</p>
                                <div class="is-wauto-box mgB_60">
                                    <table class="content_table of_n">
                                    <colgroup>
                                        <col width="8%"></col>
                                        <col width="auto"></col>
                                        <col width="6%"></col>
                                        <col width="8%"></col>
                                        <col width="1%"></col>
                                        <col width="8%"></col>
                                        <col width="auto"></col>
                                        <col width="6%"></col>
                                        <col width="8%"></col>
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>구분</th>
                                            <th>교과목명</th>
                                            <th>학점</th>
                                            <th class="borR_none">비고</th>
                                            <th class="none"></th>
                                            <th>구분</th>
                                            <th>교과목명</th>
                                            <th>학점</th>
                                            <th>비고</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>논문</td>
                                            <td>석사논문연구지도</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산공경매실무</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>논문</td>
                                            <td>석사학위청구논문</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>경영컨설팅</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산학세미나</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산조세론</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산공경매분석</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산관리론</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산공법</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산시장분석</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>경영정보학</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>소비자행동연구론</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산경제론</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산계량분석</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산마케팅</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산금융투자연습</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산투자사례분석</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산개발컨설팅</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>인사관리론</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>도시계획론</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산입지분석</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>중소기업경영론</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산사업기획론</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>도시재생이론과실무</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>감정평가이론과실무</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>관광산업입지및개발</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>재건축 · 재개발이론과실무</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산프로젝트관리</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>창업실무세미나</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산중개이론및실무</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산빅데이터분석</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>공간정보체계론</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>시장조사방법론</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>국토및지역정책세미나</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>금융자산관리이론및실무</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>전사적자원관리세미나</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산권리분석론</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>서비스경영사례분석</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>도시및지역관광개발론</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>서비스마케팅 세미나</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>도시및부동산</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>호스피탈리티전략세미나</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>경영학세미나</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>글로벌경영전략</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>문화관광상품개발론</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>글로벌비즈니스커뮤니케이션</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>경영사례연구</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>연구조사방법론</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>관광개발인적자원관리론</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산사법2</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>인문학마케팅</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>프롭테크의 이해</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>글로벌사회와경제</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>재개발과 리모델링</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>자산투자세미나</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>해외부동산시장론</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산사법1</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>호스피탈리티 마케팅 연구</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>상업용 부동산 투자가치분석 실무</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산리조트자산운영연구</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>해외부동산이해</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>관광개발경제연구</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>자산시장론연구</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>부동산리조트관리연구</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>마케팅조사분석연구</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>노사관계경영연구</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>민법및민사특별법</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>인간관계와 경영연구</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>선택</td>
                                            <td>부동산정책세미나</td>
                                            <td>2</td>
                                            <td class="borR_none"></td>
                                            <td class="none"></td>
                                            <td>선택</td>
                                            <td>휴양레저산업연구</td>
                                            <td>2</td>
                                            <td></td>
                                        </tr>
                                        </tbody>
                                    
                                    </table>
                                </div>    
                            </div>                                                    
                            </>:null}*/} 
                            
                            {/*최고경영자과정(신설)-과정 운영 개요 
                            {menuCd ==159 && <>                          
                            <div class="li_title">
                                <p class="title mgB_12">개설목적</p>
                                <div class="notitxt2 mgB_100">
                                    <p class="mgB_4 txt">우리 대학교 대학원 최고경영자과정을 운영하여 지역사회와 지역산업체의 새로운 문화 창조를 선도하며, 다양한 학문의 융·복합을 통한 미래창조적 교육과 고급정보 공유, 고급 인적자원 네트워크 구축을 통해 지역사회 발전에 이바지하고자 함</p>
                                </div>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_12">모집인원</p>
                                <p class="li_s mgL_20 mgB_80">매 학기 30명 내외</p>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_12">교육기간</p>
                                <p class="li_s mgL_20 mgB_8">1학기 (4개월) 과정, 2025년 4월 23일부터 개강</p>
                                <p class="li_s mgL_20 mgB_80">매주 수요일 19:00~21:00</p>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_12">교육장소</p>
                                <p class="li_s mgL_20 mgB_80">창신대학교 9호관 6층 AMP강의실</p>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_12">모집대상</p>
                               <p class="li_s mgL_20 mgB_8">기업체 CEO 및 임원</p>
                                <p class="li_s mgL_20 mgB_8">재테크에 관심 있는 경제인</p>
                                <p class="li_s mgL_20 mgB_8">지자체단체장, 공무원, 지방의원, 군인 등</p>
                                <p class="li_s mgL_20 mgB_8">변호사, 공인회계사, 세무사, 법무사, 건축사 등 전문직 종사자</p>
                                <p class="li_s mgL_20 mgB_8">감정평가사 및 부동산 전문가</p>
                                <p class="li_s mgL_20 mgB_8">정부투자기관 및 금융기관 등 고위 임원</p>
                                <p class="li_s mgL_20 mgB_80">기타 위와 동등한 자격 소유자(학력무관)</p>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_12">운영조직 - 대학원 내 AMP 전담 조직 구성원</p>
                                <p class="li_s mgL_20 mgB_8">책임운영교수 : 정상철 석좌교수</p>
                                <p class="li_s mgL_20 mgB_80">실무 담당자</p>
                            </div>
                            <div class="li_title">
                                <p class="title mgB_12">수강료</p>
                                <p class="li_s mgL_20">1학기 1,500,000원</p>
                            </div>
                            </>}*/} 
                            {/*최고경영자과정(신설)-과정 운영 개요  
                            {menuCd ==160 &&<>   
                            <div class="li_title">   
                            <p class="title mgB_12">교육과정표 (커리큘럼)</p>
                                <div class="is-wauto-box mgB_12">
                                    <table class="content_table of_n">
                                        <colgroup>
                                            <col width="40%"></col>
                                            <col width="auto"></col>                                            
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>구분</th>
                                                <th>주제</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td rowspan="4">리더십 및 인적자원관리<br></br>(Leadership & Human Resource Management)</td>
                                                <td>입학식 및 오리엔테이션(특강)</td>
                                            </tr>
                                            <tr>
                                                <td>창의적 인재와 혁신을 이끄는 리더십</td>
                                            </tr>
                                            <tr>
                                                <td>성공하는 리더의 창조적 리더십</td>
                                            </tr>
                                            <tr>
                                                <td>건강한 이미지 전략</td>
                                            </tr>
                                            <tr>
                                                <td rowspan="5">기업경영전략 및 재무관리<br></br>(Corporate Strategy & Financial Management)</td>
                                                <td>고령화가 기업인력운용에 미치는 영향</td>
                                            </tr>
                                            <tr>
                                                <td>성장전략과 재무회계</td>
                                            </tr>
                                            <tr>
                                                <td>지속가능성과 ESG경영</td>
                                            </tr>
                                            <tr>
                                                <td>리더가 알아야할 기업의 지배구조</td>
                                            </tr>
                                            <tr>
                                                <td>경남지역기반경제현황과 신 경영전략</td>
                                            </tr>
                                            <tr>
                                                <td rowspan="3">경제 및 글로벌 비즈니스 환경<br></br>(Economics & Global Business Environment)</td>
                                                <td>거시경제 현상의 표면과 이면</td>
                                            </tr>
                                            <tr>
                                                <td>글로벌 시장의 경영환경 변화와 대응전략</td>
                                            </tr>
                                            <tr>
                                                <td>미래산업 트렌드</td>
                                            </tr>
                                            <tr>
                                                <td rowspan="2">기술 혁신 및 개인금융관리<br></br>(Technology Innovation & Personal Finance) </td>
                                                <td>Personal Finance – How to Invest</td>
                                            </tr>
                                            <tr>
                                                <td>인공지능과 딥러닝</td>
                                            </tr>
                                            <tr>
                                                <td rowspan="2">마케팅과 커뮤니케이션<br></br>(Marketing & Communication)</td>
                                                <td>좋은 마케팅, 나쁜 마케팅, 이상한 마케팅</td>
                                            </tr>
                                            <tr>
                                                <td>정보기술을 활용한 커뮤니케이션과 기업 경쟁력</td>
                                            </tr>
                                            <tr>
                                                <td>수료식</td>
                                                <td>수료증 수여 및 단합</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p class="txtst">※ 상황에 따라 개설과목 변동가능</p>
                            </div>
                            </>}*/}
                            {/* </>} */}
                            
                            {menuCd == 182 ?<>
                            <div className='site_area'>
                                    {menuList?.map((data1, index)=> { 
                                        if(data1.DEPTH == 1){
                                        return(                                
                                            <div className='siteBox'>
                                                <div className='dep dep1'><span>{data1.MENU_NM}</span></div>
                                                <ul className='dep dep2'>
                                                {menuList?.map((data2, index)=> { 
                                                    if(data2.DEPTH == 2 && data2.PARENT_MENU_CD == data1.MENU_CD){
                                                        return(                                                    
                                                                <li><Link to={data2.LINK} target={data2.BLANK === '1' ? '_blank': undefined} >{data2.MENU_NM}</Link>
                                                                <ul className='dep3'>
                                                                    {menuList?.map((data3, index)=> { 
                                                                        if(data3.DEPTH == 3 && data3.PARENT_MENU_CD == data2.MENU_CD){
                                                                            return(                                                    
                                                                                    <li><Link to={data3.LINK} target={data3.BLANK === '1' ? '_blank': undefined} >{data3.MENU_NM}</Link>
                                                                                    {/* <ul className='dep4'>
                                                                                        {menuList?.map((data4, index)=> { 
                                                                                            if(data4.DEPTH == 4 && data4.PARENT_MENU_CD == data3.MENU_CD){
                                                                                                return(                                                    
                                                                                                        <li><Link to={data4.LINK} target={data4.BLANK === '1' ? '_blank': undefined} >{data4.MENU_NM}</Link></li>                                                    
                                                                                        )}})} 
                                                                                    </ul> */}


                                                                                    </li>                                                    
                                                                    )}})} 
                                                                </ul>
                                                                </li>                                                    
                                                )}})} </ul>                                   
                                            </div>
                                        )}
                                    })}
                                </div>
                            </>:null}

                        </div>
                        
                    </div>
                </div>

            </div>
        </>
        
    )
}

export default Sub;