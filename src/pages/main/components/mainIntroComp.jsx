import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {SERVER_URL} from 'context/config'; //
import {Link} from 'react-router-dom';

const MainIntroComp = (props) => {  
    const params = useParams();
    const menuCd = params.menuCd; 
    const containerRef = useRef();
    
    const [menuList, setMenuList] = useState([]);
    const [contentList, setContentList] = useState([]);
    const [hd_index, setHd_index] = useState(0);
    const [tabstate, setTabstate] = useState(0);
    useEffect(() => {
       const containerEl = containerRef.current;
       if (containerEl) {
         const scripts = containerEl.getElementsByTagName('script');
         for (const script of scripts) {
           window.eval(script.innerHTML);
         }
       }
    },[contentList]);

    useEffect(() => {
        Init();       
    },[menuCd]);
          
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

    function showPage(index) {
        var page = document.querySelectorAll('.page');
        for (var k = 0; k < page.length; k++) {
            page[k].classList.remove('active');
        }
        page[index].classList.add('active');

    }
    function showTab(index) {
        // 모든 탭 버튼과 콘텐츠를 숨기기
        var buttons = document.querySelectorAll('.tab_li');
        var contents = document.querySelectorAll('.dep_list');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active');
        }
        for (var j = 0; j < contents.length; j++) {
            contents[j].classList.remove('active');
        }

        // 선택한 탭 버튼과 콘텐츠 활성화
        buttons[index].classList.add('active');
        contents[index].classList.add('active');

        setTabstate(index);
    }

    function showDepart(index, index2) {
        // 모든 탭 버튼과 콘텐츠를 숨기기
        if(index2 == 1 || tabstate == 0 && (index >= 0 && index <= 9) || tabstate == 1 && (index >= 10 && index <= 16)){
            var buttons = document.querySelectorAll('.dep_li');
            var contents = document.querySelectorAll('.intro');
            var dep3 = document.querySelectorAll('.dep3');
            var page = document.querySelectorAll('.page');

            for (var i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove('active');
            }
            for (var j = 0; j < contents.length; j++) {
                contents[j].classList.remove('active');
            }
            for (var h = 0; h < dep3.length; h++) {
                dep3[h].classList.remove('active');
            }
            for (var k = 0; k < page.length; k++) {
                page[k].classList.remove('active');
            }



            if(index >= 0 && index <= 6 ){ dep3[0].classList.add('active'); page[0].classList.add('active');}
            else if(index >= 7 && index <= 9 ){ dep3[1].classList.add('active');page[0].classList.add('active'); }
            else if(index >= 10 && index <= 12 ){ dep3[2].classList.add('active'); page[1].classList.add('active');}
            else if(index >= 13 && index <= 16 ){ dep3[3].classList.add('active'); page[1].classList.add('active');}

            // 선택한 탭 버튼과 콘텐츠 활성화
            buttons[index].classList.add('active');
            contents[index].classList.add('active');        
            setHd_index(index)
        }
        
    }

    // function hd_btn(index) {
    //     // 모든 탭 버튼과 콘텐츠를 숨기기
    //     // var buttons = document.querySelectorAll('.btn');
    //     var contents = document.querySelectorAll('.intro');

    //     // for (var i = 0; i < buttons.length; i++) {
    //     //     buttons[i].classList.remove('active');
    //     // }
    //     for (var j = 0; j < contents.length; j++) {
    //         contents[j].classList.remove('active');
    //     }

    //     // 선택한 탭 버튼과 콘텐츠 활성화
    //     //buttons[index].classList.add('active');
    //     contents[index].classList.add('active');
    // }
    return(
        <>
             <div className='Main fwBgc'>
                <div className='maincontain mainIntro'>                        
                    <div className='MainTitle'>
                        <h1>학과소개</h1>
                        <div className='Maintxt'>
                            <p>창신대학교 대학원의 학과(부)를 소개합니다.</p>
                        </div>
                    </div>                                
                    <div className='area intro_area'>
                        <div className='menu'>
                            <ul className='tab'>
                                <li className='tab_li active' onClick={()=>{showTab(0);showDepart(0, 1);showPage(0)}}>일반대학원</li>
                                <li className='tab_li' onClick={()=>{showTab(1);showDepart(10, 1);showPage(1)}}>특수대학원</li>
                            </ul>
                            <ul className='dep_list active'>
                                <li className='tit'>박사과정</li>
                                <li className='dep_li active' onClick={()=>showDepart(0, 1)}>부동산경영학과</li>
                                <li className='dep_li' onClick={()=>showDepart(1 , 1)}>사회복지학과</li>
                                <li className='dep_li' onClick={()=>showDepart(2 , 1)}>유아교육학과</li>
                                <li className='dep_li' onClick={()=>showDepart(3, 1)}>글로벌비즈니스학과</li>                                            
                                <li className='dep_li' onClick={()=>showDepart(4, 1)}>간호학과</li>
                                <li className='dep_li' onClick={()=>showDepart(5, 1)}>미용예술학과</li>
                                <li className='lc dep_li' onClick={()=>showDepart(6, 1)}>스마트융합공학부</li>                                            
                                <li className='tit'>석사과정</li>
                                <li className='dep_li' onClick={()=>showDepart(7, 1)}>간호학과</li>
                                <li className='dep_li' onClick={()=>showDepart(8, 1)}>스마트융합공학부</li>
                                <li className='dep_li' onClick={()=>showDepart(9, 1)}>글로벌비즈니스학과</li>                                            
                            </ul>
                            <ul className='dep_list'>
                                <li className='tit'>부동산경영대학원</li>
                                <li className='dep_li active' onClick={()=>showDepart(10, 1)}>부동산학전공</li>
                                <li className='lc dep_li' onClick={()=>showDepart(11, 1)}>경영학전공</li>
                                {/*<li className='lc dep_li' onClick={()=>showDepart(12, 1)}>최고경영자 과정</li>*/}
                                <li className='tit'>복지문화대학원</li>
                                <li className='dep_li' onClick={()=>showDepart(12, 1)}>사회복지학과</li>                                        
                                <li className='dep_li' onClick={()=>showDepart(13, 1)}>미용예술학과</li>
                                <li className='dep_li' onClick={()=>showDepart(14, 1)}>음악학과</li>
                                <li className='dep_li' onClick={()=>showDepart(15, 1)}>유아교육학과</li> 
                                <li className='dep_li' onClick={()=>showDepart(16, 1)}>식품영양학과</li>                                       
                            </ul>
                        </div>                                 
                    </div> 
                    <div className='intro_hdBtn'>
                        <div className='btn prev' onClick={()=>showDepart(hd_index-1, 0)}></div>
                        <div className='page active'> {hd_index+1} / 10 </div>
                        <div className='page'> {hd_index-9} / 7 </div>
                        <div className='btn next' onClick={()=>showDepart(hd_index+1, 0)}></div>
                        <ul>
                            <li className='dep3 active'>박사과정</li>
                            <li className='dep3'>석사과정</li>
                            <li className='dep3'>부동산경영대학원</li>
                            <li className='dep3'>복지문화대학원</li>
                        </ul>                            
                    </div>
                        {/*일반-박사*/}
                        <div className='intro active'>
                            <img className='depb_img' src='images/main/depb2.png' />
                             <div className='txt_area'>
                                <img src='images/main/dep3.png'/>
                                <div className='txt_box'>
                                    <Link to={"/contents/90/view"}>
                                    <div className='more'>더보기</div>
                                    <p className='name'>부동산경영학과</p>
                                    <p className='txt'>창신대학교 대학원 부동산 경영학과는 융·복합 교육을 통해 창의력과 전문성을 갖춘 부동산경영 전문가를 양성하며 국가와 지역사회 발전에 기여하는 경남 최고의 부동산 경영대학원을 추구합니다.</p>
                                </Link></div>
                            </div> 
                        </div>
                        <div className='intro'>
                            <img className='depb_img' src='images/main/depb3.png' />
                             <div className='txt_area'>
                                <img src='images/main/dep2.png'/>
                                <div className='txt_box'><Link to={"/contents/94/view"}>
                                    <div className='more'>더보기</div>
                                    <p className='name'>사회복지학과</p>
                                    <p className='txt'>창신대학교 일반대학원 사회복지학과는 2020학년도 신설된 젊은 대학원입니다. 특화된 교육과정 및 교육내용을 기반으로 현장중심 사회복지이론과 실제를 학습하고 실천을 고민하며, 현장에서 필요로 하는 전문 지식을 개발하고 연구함으로써 지역사회에서 환영받는 실천형 연구자 양성을 목표로 하고 있습니다.</p>
                                </Link></div>
                            </div> 
                        </div> 
                        <div className='intro'>
                            <img className='depb_img' src='images/main/depb4.png' />
                             <div className='txt_area'>
                                <img src='images/main/dep5.png'/>
                                <div className='txt_box'><Link to={"/contents/98/view"}>
                                    <div className='more'>더보기</div>
                                    <p className='name'>유아교육학과</p>
                                    <p className='txt'>창신대학교 일반대학원 유아교육학과 박사과정은 미래사회에 필요한 교육역량을 갖춘 유아교육전문가를 양성하기 위해 2025학년도에 신설되며 이론과 실천이 연계 될 수 있는 유아교사들의 전문적인 배움의 장이 되고자 합니다. 4차 산업시대에 발맞추어 미래 유아교사가 갖추어야 할 역량을 기르기 위해 이론 분야의 깊이 있는 학문연구와 더불어 유아교육현장의 다양한 문제를 해결하기 위한 현장실무중심의 교육과정을 운영하여 실천적 능력을 갖춘 유아교육전문가를 양성하고자 합니다.</p>
                                </Link></div>
                            </div> 
                        </div>
                        <div className='intro'>
                            <img className='depb_img' src='images/main/depb5.png' />
                             <div className='txt_area'>
                                <img src='images/main/dep11.png'/>
                                <div className='txt_box'><Link to={"/contents/103/view"}>
                                    <div className='more'>더보기</div>
                                    <p className='name'>글로벌비즈니스학과</p>
                                    <p className='txt'>창신대학교 일반대학원 글로벌비즈니스 학과는 글로벌 환경에 맞는 융·복합 사고력과 전문성을 겸비하여 글로벌 비즈니스 환경에서 성공적으로 활동할 수 있도록 지식과 기술을 함양한 전문가를 양성하는 학과로서, 비즈니스 전공지식과 더불어 다양한 문화적 소양 학습을 통하여 글로벌 인재를 양성하고자 합니다.</p>
                                </Link></div>
                            </div> 
                        </div>   
                        <div className='intro'>
                            <img className='depb_img' src='images/main/depb1.png' />
                             <div className='txt_area'>
                                <img src='images/main/dep1.png'/>
                                <div className='txt_box'><Link to={"/contents/107/view"}>
                                    <div className='more'>더보기</div>
                                    <p className='name'>간호학과</p>
                                    <p className='txt'>창신대학교 일반대학원 간호학과는 봉사의 윤리인, 창의적 전문인, 진취적 세계인을 구현하는 우리 대학교의 인재상과 4차 산업혁명시대의 기본인 CLEAN역량을 토대로 인본주의와 인간존엄성에 근거한 전인적 인간이해와 21세기 보건·의료 환경 변화에 능동적 대처역량을 겸비한 창의적인 글로컬 지도자를 양성하는데 그 목적을 두고 있다. 특히 2023학년도부터는 간호연구와 근거기반간호에 대한 지역사회의 요구에 따라 간호학 박사과정을 개설하여 운영하고 있다. </p>
                                </Link></div>
                            </div> 
                        </div>
                        <div className='intro'>
                            <img className='depb_img' src='images/main/depb6.png' />
                             <div className='txt_area'>
                                <img src='images/main/dep4.png'/>
                                <div className='txt_box'><Link to={"/contents/111/view"}>
                                    <div className='more'>더보기</div>
                                    <p className='name'>미용예술학과</p>
                                    <p className='txt'>창신대학교 미용예술학과는 경상남도 유일의 4년제 미용학과로 2017학년도 특수대학원 석사과정을 개설하였고 2023학년도 일반대학원 박사과정을 신설하였다. 미용산업 현장에서 필요로 하는 새로운 기술과 뷰티트렌드를 연구, 개발함으로써 지역사회 미용산업 발전과 K뷰티 확산에 기여할 수 있는 창의적 리더 양성을 목표로 한다. </p>
                                </Link></div>
                            </div> 
                        </div>
                        <div className='intro'>
                            <img className='depb_img' src='images/main/depb7.png' />
                             <div className='txt_area'>
                                <img src='images/main/dep6.png'/>
                                <div className='txt_box'><Link to={"/contents/115/view"}>
                                    <div className='more'>더보기</div>
                                    <p className='name'>스마트융합공학부</p>
                                    <p className='txt'>창신대학교 일반대학원 스마트융합공학부는 4차산업혁명 시대에서 다분야 지식, 기술 및 역량을 갖춘 미래형 융합적 공학 전문 기술인을 양성하기 위해 소방방재공학전공, 항공기계공학전공, 컴퓨터공학전공의 3개 전공이 학제적 연계(interdisciplinary) 구성되어 있으며, 총정원제 공학석사·공학박사 학위과정으로 운영됩니다.</p>
                                </Link></div>
                            </div> 
                        </div>
                        {/*일반-석사*/}
                        <div className='intro'>
                            <img className='depb_img' src='images/main/depb1.png' />
                             <div className='txt_area'>
                                <img src='images/main/dep1.png'/>
                                <div className='txt_box'><Link to={"/contents/119/view"}>
                                    <div className='more'>더보기</div>
                                    <p className='name'>간호학과</p>
                                    <p className='txt'>창신대학교 일반대학원 간호학과는 봉사의 윤리인, 창의적 전문인, 진취적 세계인을 구현하는 우리 대학교의 인재상과 4차 산업혁명시대의 기본인 CLEAN역량을 토대로 인본주의와 인간존엄성에 근거한 전인적 인간이해와 21세기 보건·의료 환경 변화에 능동적 대처역량을 겸비한 창의적인 글로컬 지도자를 양성하는데 그 목적을 두고 있다.특히 2018학년도에는 사회적 수요가 급증하는 호스피스전문간호사 양성과정을 석사과정에 개설하여 운영하고 있다. </p>
                                </Link></div>
                            </div> 
                        </div>          

                        <div className='intro'>
                            <img className='depb_img' src='images/main/depb7.png' />
                             <div className='txt_area'>
                                <img src='images/main/dep6.png'/>
                                <div className='txt_box'><Link to={"/contents/123/view"}>
                                    <div className='more'>더보기</div>
                                    <p className='name'>스마트융합공학부</p>
                                    <p className='txt'>창신대학교 일반대학원 스마트융합공학부는 4차산업혁명 시대에서 다분야 지식, 기술 및 역량을 갖춘 미래형 융합적 공학 전문 기술인을 양성하기 위해 소방방재공학전공, 항공기계공학전공, 컴퓨터공학전공의 3개 전공이 학제적 연계(interdisciplinary) 구성되어 있으며, 총정원제 공학석사·공학박사 학위과정으로 운영됩니다.</p>
                                </Link></div>
                            </div> 
                        </div>

                        <div className='intro'>
                            <img className='depb_img' src='images/main/depb5.png' />
                             <div className='txt_area'>
                                <img src='images/main/dep11.png'/>
                                <div className='txt_box'><Link to={"/contents/127/view"}>
                                    <div className='more'>더보기</div>
                                    <p className='name'>글로벌비즈니스학과</p>
                                    <p className='txt'>창신대학교 일반대학원 글로벌비즈니스 학과는 글로벌 환경에 맞는 융·복합 사고력과 전문성을 겸비하여 글로벌 비즈니스 환경에서 성공적으로 활동할 수 있도록 지식과 기술을 함양한 전문가를 양성하는 학과로서, 비즈니스 전공지식과 더불어 다양한 문화적 소양 학습을 통하여 글로벌 인재를 양성하고자 합니다.</p>
                                </Link></div>
                            </div> 
                        </div> 
                        {/*특수-부동산경영대학원*/}
                        <div className='intro'>
                            <img className='depb_img' src='images/main/depb2.png' />
                             <div className='txt_area'>
                                <img src='images/main/dep7.png'/>
                                <div className='txt_box'><Link to={"/contents/151/view"}>
                                    <div className='more'>더보기</div>
                                    <p className='name'>부동산학전공</p>
                                    <p className='txt'>창신대학교 부동산경영대학원은 융·복합 교육을 통해 창의력과 전문성을 갖춘 부동산 전문가를 양성하여 국가와 사회발전에 기여하는 경남 최고의 부동산경영대학원을 지향한다.</p>
                                </Link></div>
                            </div> 
                        </div> 
                        <div className='intro'>
                            <img className='depb_img' src='images/main/depb9.png' />
                             <div className='txt_area'>
                                <img src='images/main/dep3.png'/>
                                <div className='txt_box'><Link to={"/contents/155/view"}>
                                    <div className='more'>더보기</div>
                                    <p className='name'>경영학전공</p>
                                    <p className='txt'>창신대학교 부동산경영대학원은 융·복합 교육을 통해 창의력과 전문성을 갖춘 부동산 전문가를 양성하여 국가와 사회발전에 기여하는 경남 최고의 부동산경영대학원을 지향한다. </p>
                                </Link></div>
                            </div> 
                        </div>
                        {/*<div className='intro'>
                            <img className='depb_img' src='images/main/depb8.png' />
                             <div className='txt_area'>
                                <img src='images/main/dep8.png'/>
                                <div className='txt_box'>
                                    <div className='more'>더보기</div>
                                    <p className='name'>최고경영자 과정</p>
                                    <p className='txt'></p>
                                </div>
                            </div> 
                        </div>*/}
                        {/*특수-복지문화대학원*/}
                        <div className='intro'>
                            <img className='depb_img' src='images/main/depb3.png' />
                             <div className='txt_area'>
                                <img src='images/main/dep2.png'/>
                                <div className='txt_box'><Link to={"/contents/131/view"}>
                                    <div className='more'>더보기</div>
                                    <p className='name'>사회복지학과</p>
                                    <p className='txt'>창신대학교 복지문화대학원(특수대학원) 사회복지학과는 2017학년도 신설된 젊은 대학원입니다. 특화된 교육과정 및 교육내용을 기반으로 현장중심 사회복지이론과 실제를 학습하고 실천을 고민하며, 현장에서 필요로 하는 전문 지식을 개발하고 연구함으로써 지역사회에서 환영받는 실천형 연구자 양성을 목표로 하고 있습니다. </p>
                                </Link></div>
                            </div> 
                        </div>
                        <div className='intro'>
                            <img className='depb_img' src='images/main/depb6.png' />
                             <div className='txt_area'>
                                <img src='images/main/dep4.png'/>
                                <div className='txt_box'><Link to={"/contents/135/view"}>
                                    <div className='more'>더보기</div>
                                    <p className='name'>미용예술학과</p>
                                    <p className='txt'>창신대학교 미용예술학과는 경상남도 유일의 4년제 미용관련 학부 및 대학원으로 연구역량을 겸비한 학문적인 리더, 뷰티아트 창의력을 겸비한 예술적인 리더를 양성하여 새로운 뷰티 트렌드를 창출·확산하고 미용산업 및 미용문화 발전에 기여하는 것을 목표로 한다.</p>
                                </Link></div>
                            </div> 
                        </div>
                        <div className='intro'>
                            <img className='depb_img' src='images/main/depb10.png' />
                             <div className='txt_area'>
                                <img src='images/main/dep9.png'/>
                                <div className='txt_box'><Link to={"/contents/139/view"}>
                                    <div className='more'>더보기</div>
                                    <p className='name'>음악학과</p>
                                    <p className='txt'>음악대학원은 우리 대학의 인재상인 「봉사의 윤리인, 창의적 전문인, 진취적 세계인」에 맞추어 2019학년도에 신설된 대학원이다. 이론분야의 심도 깊은 학문연구와 연주자의 실기능력 향상에 특화된 커리큘럼으로 빠르게 변화되는 음악교육현장에 바로 적용하며, 나아가 지역사회에 봉사하며 창의적이고 세계적인 안목을 갖춘 전문연주자 양성을 목표로 한다</p>
                                </Link></div>
                            </div> 
                        </div>
                        <div className='intro'>
                            <img className='depb_img' src='images/main/depb4.png' />
                             <div className='txt_area'>
                                <img src='images/main/dep5.png'/>
                                <div className='txt_box'><Link to={"/contents/143/view"}>
                                    <div className='more'>더보기</div>
                                    <p className='name'>유아교육학과</p>
                                    <p className='txt'>창신대학교 복지문화대학원 유아교육학과는 미래사회에 필요한 교육역량을 갖춘 유아교육전문가를 양성하기 위해 2020학년도에 신설되며 이론과 실천이 연계 될 수 있는 유아교사들의 전문적인 배움의 장이 되고자 합니다. 4차 산업시대에 발맞추어 미래 유아교사가 갖추어야 할 역량을 기르기 위해 이론 분야의 깊이 있는 학문연구와 더불어 유아교육현장의 다양한 문제를 해결하기 위한 현장실무중심의 교육과정을 운영하여 실천적 능력을 갖춘 유아교육전문가를 양성하고자 합니다.</p>
                                </Link></div>
                            </div> 
                        </div>
                        <div className='intro'>
                            <img className='depb_img' src='images/main/depb11.png' />
                             <div className='txt_area'>
                                <img src='images/main/dep10.png'/>
                                <div className='txt_box'><Link to={"/contents/147/view"}>
                                    <div className='more'>더보기</div>
                                    <p className='name'>식품영양학과</p>
                                    <p className='txt'>복지문화대학원 식품영양학과 식품산업학 석사과정에서는 적문적이고 체계적인 현장 중심 커리큘럼 운영을 통해 식품산업 발전을 선두하고, 새로운 식품 및 외식 트렌드를 창출 할 수 있는 창의적 인재 양성을 목표로 한다. </p>
                                </Link></div>
                            </div> 
                        </div>       




                        <img className="book" src='images/main/intro1.png'/> 
                         
                    </div>    
                                
            </div>        

           
        </>
        
    )
}

export default MainIntroComp;