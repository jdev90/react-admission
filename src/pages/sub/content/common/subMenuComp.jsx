import React, { useState, useEffect} from 'react';
import {  Link, useParams } from 'react-router-dom';
import {SERVER_URL} from 'context/config'; //

const SubMenuComp = (props) => {    
    const params = useParams();
    const menuCd = params.menuCd; 
    const [menuList, setMenuList] = useState([]);
    let dep3_MC;let dep3_NM;

    useEffect(() => {
        Init();       
    },[menuCd]);

      
    const Init = async () =>{
        try{
            const res1 = await fetch(SERVER_URL+'/api/menu/list',{method:"POST", headers:{'content-type':'application/json'}});
            const data1 = await res1.json();  
            setMenuList(data1.getMenuList);
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
        {menuList?.map((data, index)=> {
           if(data.DEPTH == 4 && data.MENU_CD == menuCd ){
                menu(menuCd);
                return(
                <div className='dep4_m_box'>
                    <div className='page_title'>{dep3_NM}<p>Chanshin University Graduate Schcool</p></div>
                    <div className='page_menu'>
                        <ul>
                            {menuList?.map((data1, index)=> {
                                if(data1.DEPTH == 4 && data1.PARENT_MENU_CD == dep3_MC){
                                    return(
                                        <li className={menuCd == data1.MENU_CD &&'back'}><Link to={data1.LINK}><p>{data1.MENU_NM}</p></Link></li>
                                    )
                                }
                            })}
                        </ul>
                    </div>
                </div>
                )
            }
        })}
        </>
    )

}

export default SubMenuComp;