import React, { useState, useEffect } from 'react';
import {  Link, useLocation  } from 'react-router-dom';
// import qs from 'qs';
import {SERVER_URL} from '../../../context/config';

const PathbarComp = (props) => {
    const [menuList, setMenuList] = useState([]);    
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    //const query = qs.parse(location.search, {ignoreQueryPrefix: true});  
    const menuCd = props.menuCd //
    // let dep1_parents_menucd;
    // let dep2_parents_menucd;
    // let dep3_parents_menucd;
    let dep1_MC;let dep2_MC;let dep3_MC;let dep4_MC;


    useEffect(() => {
        
        Init();
    },[menuCd]);

    useEffect(() => {
        if(menuList.length > 0){
            setLoading(true);
        }

    }, [menuList]);

    const Init = async () =>{
        try{
            const res = await fetch(SERVER_URL+'/api/menu/list',{method:"POST", headers:{'content-type':'application/json'}});
            const data = await res.json();  
            setMenuList(data.getMenuList); 
            // authChk(data.getMenuList);
            
        }catch(e){
            console.log(e);
        }
    }

    // function authChk(list) {
    //     let privacy;let reply;let user_write;
    //     for(var i=0;i<list.length;i++){
    //         if(list[i].MENU_CD == menuCd){
    //             privacy =list[i].PRIVACY
    //             reply = list[i].REPLY
    //             user_write = list[i].USER_WRITE
    //         }
    //     }
    //     if (typeof props.onMessage === 'function') {
    //         props.onMessage({ privacy, reply, user_write })    
    //     }
    // }

    function menu(menuCd) {
        let i
        var buttons = document.querySelectorAll('.path');
        for (var j = 0; j < buttons.length; j++) {
            buttons[j].classList.remove('active');
        }
        for(i=0; i < menuList.length; i++){
            if(menuCd == menuList[i].MENU_CD){
                if(menuList[i].DEPTH == 4){
                    dep4_MC = menuCd
                    dep3_MC = menuList[i].PARENT_MENU_CD //dep4면 부모dep3 메뉴코드 저장
                }  
                else if(menuList[i].DEPTH == 3){
                    dep3_MC = menuCd
                    dep2_MC = menuList[i].PARENT_MENU_CD //dep3면 부모dep2 메뉴코드 저장
                }   
                else if(menuList[i].DEPTH == 2){
                    dep2_MC = menuCd
                    dep1_MC = menuList[i].PARENT_MENU_CD  //dep2면 부모dep2 메뉴코드 저장
                    return
                }             
                return menu(menuList[i].PARENT_MENU_CD) //현 메뉴코드의 부모메뉴코드 넣고 다시
            }
        }    
    }

    function showTab(index) {
        var buttons = document.querySelectorAll('.path');
        var isActive = buttons[index].classList.contains('active');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active');
        }
        if (!isActive) {
            buttons[index].classList.add('active');
        }
    }


    return(
        <>
            <div className='subBannerMenu_area'>
                <ul className="pathbar">
                    <li className='path_R'><Link to="/"><img src={'/images/sub/homeWW.png'} alt='창신대학교 대학원 홈페이지'/></Link></li>
                    {menuList?.map((data, index)=> {
                        menu(menuCd);
                        if(data.DEPTH == 1 && data.MENU_CD == dep1_MC){// data2.DEPTH == 2  && data2.PARENT_MENU_CD == data1.MENU_CD
                           return(
                                <li className='path active' onClick={()=>showTab(0)}>
                                    <span>{data.MENU_NM}</span>
                                    <div className='hd_dep4'>
                                    {menuList?.map((data1, index)=> {
                                        if(data1.DEPTH == 1){
                                            return(
                                                <Link to={data1.LINK}><p>{data1.MENU_NM}</p></Link>
                                            )
                                        }
                                    })}
                                    </div>
                                </li>  
                           )
                        }
                        if(data.DEPTH == 2 && data.MENU_CD == dep2_MC){// data2.DEPTH == 2  && data2.PARENT_MENU_CD == data1.MENU_CD
                           return(
                                <li className='path active' onClick={()=>showTab(1)}>
                                    <span>{data.MENU_NM}</span>
                                    <div className='hd_dep4'>
                                    {menuList?.map((data2, index)=> {
                                        if(data2.DEPTH == 2 && data2.PARENT_MENU_CD == dep1_MC){
                                            return(
                                                <Link to={data2.LINK}><p>{data2.MENU_NM}</p></Link>
                                            )
                                        }
                                    })}
                                    </div>
                                </li>  
                           )
                        }
                        if(data.DEPTH == 3 && data.MENU_CD == dep3_MC){// data2.DEPTH == 2  && data2.PARENT_MENU_CD == data1.MENU_CD
                           return(
                                <li className='path active' onClick={()=>showTab(2)}>
                                    <span>{data.MENU_NM}</span>
                                    <div className='hd_dep4'>
                                    {menuList?.map((data3, index)=> {
                                        if(data3.DEPTH == 3 && data3.PARENT_MENU_CD == dep2_MC){
                                            return(
                                                <Link to={data3.LINK}><p>{data3.MENU_NM}</p></Link>
                                            )
                                        }
                                    })}
                                    </div>
                                </li>  
                           )
                        }
                        if(data.DEPTH == 4 && data.MENU_CD == dep4_MC){// data2.DEPTH == 2  && data2.PARENT_MENU_CD == data1.MENU_CD
                           return(
                                <li className='path active' onClick={()=>showTab(3)}>
                                    <span>{data.MENU_NM}</span>
                                    <div className='hd_dep4'>
                                    {menuList?.map((data4, index)=> {
                                        if(data4.DEPTH == 4 && data4.PARENT_MENU_CD == dep3_MC){
                                            return(
                                                <Link to={data4.LINK}><p>{data4.MENU_NM}</p></Link>
                                            )
                                        }
                                    })}
                                    </div>
                                </li>  
                           )
                        }
                        
                        
                    })}
                </ul>
            </div>
        </>
    )
}

export default PathbarComp;

