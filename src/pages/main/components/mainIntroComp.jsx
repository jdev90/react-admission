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

    return(
        <>
             <div className='fwBgc'>
                <div className='Maincontain MainIntro'>                        
                    <div className='MainTitle'>
                        <p>창신대학교의 입시 관련 주요 서비스입니다.</p>
                        <h1>CSU<span>안내책자</span></h1>
                    </div>                                
                    
                    
                    

                        
                </div>    
                                
            </div>        

           
        </>
        
    )
}

export default MainIntroComp;