import React, { useState, useEffect, useRef  } from 'react';
import {  Link, useParams, useLocation ,useNavigate  } from 'react-router-dom';
import { SERVER_URL } from "context/config";
import SubBannerComp from 'pages/common/components/subBannerComp';

const Sitemap = (props) => {    
    const params = useParams();
    const [menuList, setMenuList] = useState([]);

    useEffect(() => {
       Init();
        window.scrollTo(0, 0);
    },[]);

    
      
    const Init = async () =>{
        try{
            const res1 = await fetch(SERVER_URL+'/api/menu/list',{method:"POST", headers:{'content-type':'application/json'}});
            const data1 = await res1.json();  
            setMenuList(data1.getMenuList);
            
        }catch(e){
            console.log(e);
        }
    }
    
        
    return(
        <>
            {/* <SubBannerComp menuCd={menuCd}/> */}
            <SubBannerComp menuCd={null}/>
            <div className='Subcontain'>
                <div className='noneContentMenu-box'>
                    <div className='logintitle'><p>사이트맵</p></div>
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
            </div>
        </>
        
    )
}

export default Sitemap;