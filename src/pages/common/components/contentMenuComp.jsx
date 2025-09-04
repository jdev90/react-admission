import React, { useState, useEffect} from 'react';
import {  Link, useParams , useLocation} from 'react-router-dom';
import {SERVER_URL} from 'context/config'; //
import {getMenuInfoMenuCd} from "assets/js/utils";

const ContentMenuComp = (props) => {    
    const menuCd = props.menuCd 
    let menuInfo = getMenuInfoMenuCd(menuCd);
    const [menuList, setMenuList] = useState([]);

    useEffect(() => {
        Init();       
    },[menuInfo?.MENU_CD]);

      
    const Init = async () =>{
        try{
            const res1 = await fetch(SERVER_URL+'/api/menu/list',{method:"POST", headers:{'content-type':'application/json'}});
            const data1 = await res1.json();  
            setMenuList(data1.getMenuList);
        }catch(e){
            console.log(e);
        }
    }

    
    function showTab(index) {
        // 모든 탭 버튼과 콘텐츠를 숨기기
        var buttons = document.querySelectorAll('.dep2_nm');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active');
        }
        // 선택한 탭 버튼과 콘텐츠 활성화
        buttons[index].classList.add('active');
    }
    return(
        <>
        {/*<div className='contentMenu'>
            <div className='dep1_nm'><p>수시모집</p></div>
            <ul className='dep2'>
                <li><Link><p className='dep2_nm active' onClick={() => showTab(0) }>전형일정</p><img src='/images/sub/content/comm_menu.png'/></Link></li>
                <li><Link><p className='dep2_nm' onClick={() => showTab(1) }>모집요강</p><img src='/images/sub/content/comm_menu.png'/></Link></li>
                <li><Link><p className='dep2_nm' onClick={() => showTab(2) }>안내책자</p><img src='/images/sub/content/comm_menu.png'/></Link></li>
                <li><Link><p className='dep2_nm' onClick={() => showTab(3) }>원서접수</p><img src='/images/sub/content/comm_menu.png'/></Link></li>
                <li><Link><p className='dep2_nm' onClick={() => showTab(4) }>경쟁률조회</p><img src='/images/sub/content/comm_menu.png'/></Link></li>
            </ul>
        </div>*/}
        <div className='contentMenu'>
            {menuList?.map((data, index)=> {
            if(data.DEPTH === "1" &&  data.MENU_CD === menuInfo?.PARENT_MENU_CD){
                return(<>
                    <div className='dep1_nm'><p>{data.MENU_NM}</p></div>
                    <ul className='dep2'>
                        {menuList?.map((data1, index1)=> {
                            if(data1.DEPTH === "2" && data1.PARENT_MENU_CD == menuInfo?.PARENT_MENU_CD){
                                return(
                                    <li key={index1}><Link to={data1.LINK} target={data1.BLANK == "1" ? "_blank":''}><p className={menuInfo?.MENU_CD == data1.MENU_CD ? 'dep2_nm active' : 'dep2_nm'} onClick={() => showTab(index1-(index+1)) }>{data1.MENU_NM}</p><img src='/images/sub/content/comm_menu.png'/></Link></li>
                                )
                            }
                        })}
                    </ul></>
                )
                }
            })}
        </div> 
        </>
    )

}

export default ContentMenuComp;