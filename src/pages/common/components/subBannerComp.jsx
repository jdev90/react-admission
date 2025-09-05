import React, { useState, useEffect } from 'react';
import {  Link, useParams } from 'react-router-dom';
import SubBannerMenuComp from 'pages/common/components/subBannerMenuComp';
import {SERVER_URL} from '../../../context/config';
import {getMenuInfoMenuCd} from "assets/js/utils";

const SubBannerComp = (props) => {
    const menuCd = props.menuCd 
    const [menuList, setMenuList] = useState([]); 
    const menuInfo = getMenuInfoMenuCd(menuCd);
    const menuP = menuInfo?.PARENT_MENU_CD
    useEffect(() => {
        Init()
    },[menuCd]);
    
    const Init = async () =>{
        try{
            const res = await fetch(SERVER_URL+'/api/menu/list',{method:"POST", headers:{'content-type':'application/json'}});
            const data = await res.json();  
            setMenuList(data.getMenuList); 
            //authChk(data.getMenuList);                    
        }catch(e){
            console.log(e);
        }
    }

    {/*function authChk(list) {
        let privacy;let reply;let user_write;
        for(var i=0;i<list.length;i++){
            if(list[i].MENU_CD == menuCd){
                privacy =list[i].PRIVACY
                reply = list[i].REPLY
                user_write = list[i].USER_WRITE
            }
        }
        if (typeof props.onMessage === 'function') {
            props.onMessage({ privacy, reply, user_write })    
        }
    }
    function menu(menuCd) {
        let i
        for(i=0; i < menuList.length; i++){
            if(menuCd == menuList[i].MENU_CD){
                if(menuList[i].DEPTH == 2){
                    dep1_MC = menuList[i].PARENT_MENU_CD  //dep2면 부모dep2 메뉴코드 저장
                    return
                }             
                return menu(menuList[i].PARENT_MENU_CD) //현 메뉴코드의 부모메뉴코드 넣고 다시
            }
        }    
    }*/}
    
    return(
        <div className='banner'>
            <div className='subBannerImgbox'>
                <img src="/images/sub/sub_banner.png" alt='서브페이지 배너'/>
            </div> 
            <div className='subBannertxt'>
                {menuCd != null && menuList?.map((data, index)=> {
                    if(data.DEPTH == 1 && data.MENU_CD == menuP){
                        return(<>
                        <p className='dep1'>{data.MENU_NM}</p>
                        <p>ALL NEW CSU, 새로운 CSU! 시작은 NEW! 주인공은 YOU!</p>
                        </>)
                    }
                })}
                {menuCd == null && 
                    <>
                    <p className='dep1'>창신대학교</p>
                    <p>ALL NEW CSU, 새로운 CSU! 시작은 NEW! 주인공은 YOU!</p>
                    </>
                }
                {/* {dep1_MC == undefined &&
                    <div className='dep1'>
                        <p>창신대학교 대학원</p>
                    </div> 
                } */}
                
                
            </div>  
            <SubBannerMenuComp menuCd={menuCd} />

        </div>
        
    )
}

export default SubBannerComp;