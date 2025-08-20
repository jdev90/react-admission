import React, { useState, useEffect } from 'react';
import {  Link, useParams } from 'react-router-dom';
import PathbarComp from 'pages/common/components/pathbarComp';
import {SERVER_URL} from '../../../context/config';

const SubBannerComp = (props) => {
    const menuCd = props.menuCd 
    const [menuList, setMenuList] = useState([]); 
   
    let dep1_MC;
    useEffect(() => {
        Init();
    },[menuCd]);
    
    const Init = async () =>{
        try{
            const res = await fetch(SERVER_URL+'/api/menu/list',{method:"POST", headers:{'content-type':'application/json'}});
            const data = await res.json();  
            setMenuList(data.getMenuList); 
            authChk(data.getMenuList);
                    
        }catch(e){
            console.log(e);
        }
    }

    function authChk(list) {
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
    }
    
    return(
        <div className='banner'>
            <div className='subBannerImgbox'>
                <img src="/images/main/banner6.png" alt='서브페이지 배너'/>
            </div> 
            <div className='subBannertxt'>
                {menuList?.map((data, index)=> {
                    menu(menuCd)  
                    
                    if(data.DEPTH == 1 && data.MENU_CD == dep1_MC ){
                        return(
                        <div className='dep1'>
                            <p>{data.MENU_NM}</p>
                        </div> 
                        )
                    }
                })}
                {dep1_MC == undefined &&
                    <div className='dep1'>
                        <p>창신대학교 대학원</p>
                    </div> 
                }
                <div className='slo'>
                    <p>사회가 필요로 하는 <span>전문인력 양성</span>하는</p>
                    <p>창신대학교 대학원</p>
                </div>
            </div>  
            <PathbarComp menuCd={menuCd} />

        </div>
        
    )
}

export default SubBannerComp;