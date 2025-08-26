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
            
            const res = await fetch(SERVER_URL+"/api/contents/"+menuCd+"/view",{method:"GET", headers:{'content-type':'application/json'}});
            const data = await res.json();  
            setContentList(data.getContentsView);
            
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
        </>
        
    )
}

export default Sub;