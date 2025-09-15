import React, { useState, useEffect } from 'react';
import {Link , useLocation,useParams  } from 'react-router-dom';
import {SERVER_URL} from '../../context/config'; //
import URL from '../../context/url'; 
import { isTokenValid, getUserRoles } from 'assets/js/jwt';
import qs from 'qs';

const Top = (props) => {
//     // const params = useParams();
//     // const menuCd = params.menuCd;
// const menuCd = props.menuCd 

    const [menuList, setMenuList] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const [isMenuHovered, setIsMenuHovered] = useState(false);
    const [menuName, setMenuName] = useState("대학원");
    //
    const [isOpen, setIsOpen] = useState(false); //
    const [isClick, setIsClick] = useState(-1); //

    //로그인
    const location = useLocation();
    const query = qs.parse(location.search, {ignoreQueryPrefix: true});
    const [loginHTML, setLoginHTML] = useState('');
    const [isLogin, setIsLogin] = useState(false);
    const token = sessionStorage.getItem('accessToken'); //
    const roles = getUserRoles(token);

    const { pathname } = useLocation();
    useEffect(() => {
        if(token != null){
            setIsLogin(true);
        }else{
            setIsLogin(false);
        }
        Init();
    },[]);
    

    

    useEffect(() => {
        if(token == null){
            const fullUrl = window.location.href;
            // URL을 파싱하여 pathname과 search 가져오기
            if(query.boardId){setLoginHTML(<Link to={URL.LOGIN+'?url='+`${location.pathname}`+'&boardId='+query.boardId+'&menuId='+query.menuId}>로그인</Link>);}
            else{setLoginHTML(<Link to={URL.LOGIN+'?url='+`${location.pathname}${location.search}`}>로그인</Link>);} //  로그인 이전 페이지 기억 하기위한
        }else{
            // setLoginHTML(<span onClick={()=>handleLogOut()}   style={{cursor : 'pointer'}}>로그아웃</span>);
            setLoginHTML(<Link onClick={()=>handleLogOut()} to={"/"}  style={{cursor : 'pointer'}}>로그아웃</Link>);

        }
    },[location, isLogin]);

    const handleLogOut = () => {
        setIsLogin(false);
        sessionStorage.removeItem('accessToken');
        setLoginHTML(<Link to={URL.LOGIN+'?url='+`${location.pathname}${location.search}`}>로그인</Link>);
    }
    
    const Init = async () =>{
        try{    
            const res = await fetch(SERVER_URL+'/api/menu/list',{method:"POST", headers:{'content-type':'application/json' }});
            const data = await res.json();   
            setMenuList(data.getMenuList);
            sessionStorage.setItem("menuList", JSON.stringify(data.getMenuList));
        }catch(e){
            console.log(e);
        }
    }
   

    const openPostInNewWindow = () => {
        // 새 창을 위한 form을 생성
        const form = document.createElement('form');
        form.method = 'get';
        form.action = URL.ADMIN; // 새로운 프론트엔드 페이지 경로
      
        // 데이터를 form에 추가
        const input1 = document.createElement('input');
        input1.type = 'hidden';
        input1.name = 'accessToken';
        input1.value = token;
        form.appendChild(input1);
      
        // 새 창을 열고 form을 그 창에 추가
        const newWindow = window.open('', '_blank');  // 빈 새 창 열기
      
        // form을 새 창에 append하고 submit
        newWindow.document.body.appendChild(form);
        form.submit();  // POST 요청 전송
    };

    const handleOpenMenu = (state) => {
        if(state){
            setIsOpen(true);
            handleClickMenu();
            document.body.style.overflow = "hidden";
        }
        else{
            setIsOpen(false);
            document.body.style.overflow = "scroll";
        }
    }
    const handleClickMenu = (index) => { 
        setIsClick(index);
        if (isClick == -1){ setIsClick(index); }
        else if(isClick == index){ setIsClick(-1);}
    }
    
    function backC() {
        var top = document.querySelector('#header');
        {pathname !== URL.MAIN ? top.classList.add('backC'):top.classList.remove('backC')}
    }

    return(
        
        <header id="header" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className={isMenuHovered ? 'active' : ""}>
            <div className='Top'>
                <div className='loginTab'>
                    <div className='tab leftT'><Link to="https://www.cs.ac.kr/" target="_blank">창신대학교</Link></div>
                    <ul className='tab rightT'> 
                        
                        {roles.some(role => ["ADMIN", "IPSI_MANAGER"].includes(role)) && <li className='cms'><a onClick={openPostInNewWindow}>관리자</a></li> }               
                        <form id="adminFrm" method="POST" action={URL.ADMIN} style={{display:'none'}}>
                            <input type="hidden" name="accessToken" value={token}/>
                        </form>
                        <li>{loginHTML}</li>  {/*로그인*/}
                    </ul>
                </div>
                <div className='logoTab'>
                    <div className='tab logo' onMouseEnter={() => setIsHovered(true)} >
                        <Link to={"/"}>
                            <img className='pcLogo' src={isHovered ? "/images/top_logoB.png" : "/images/top_logoW.png"}  alt="창신대학교 입학안내 홈페이지"/>
                            <span className='home_p_name'>입학안내</span>
                        </Link>
                    </div>
                    
                    <ul className='tab topmenu' onMouseEnter={() => setIsMenuHovered(true)} onMouseLeave={() => setIsMenuHovered(false)} onClick={() => setIsMenuHovered(false)}>
                        {menuList?.map((data1, index)=> {
                            if(data1.DEPTH == 1 && data1.MENU_CD != 179){                                
                                return (
                                    <li key={index} className='dep1'>{data1.MENU_NM}
                                        <ul className='dep2'>
                                            {menuList?.map((data2, index)=> {
                                                if(data2.DEPTH == 2 && data2.PARENT_MENU_CD == data1.MENU_CD){
                                         
                                                    return(
                                                        <li key={index}><Link to={data2.LINK } target={data2.BLANK == "1" ? "_blank":''}>{data2.MENU_NM}</Link></li>
                                                )}
                                            })}
                                        </ul>
                                    </li>
                            ) }
                        })}
                        <li className='dep1 ex_link'><div><Link to={"https://www.cs.ac.kr/document/college?tab=1"} target='_blank'>학과안내<img src='/images/top_exlink.png'/></Link></div></li>
                        {/* <li className='dep1 ex_link'><div className='vdo'><Link>홍보영상<img src='/images/top_exlink.png'/></Link></div></li> */}
                        <li className='sitem'><Link to={URL.SITEMAP}><img src={isHovered ? '/images/top_sitemB.png' : '/images/top_sitemW.png'}/></Link></li>
                    </ul> 
                    <div className='mob_menubtn' onClick={() =>{isOpen ? handleOpenMenu(false): handleOpenMenu(true)}}><img src={isHovered ? '/images/top_sitemB.png' : '/images/top_sitemW.png'}/></div>

                    {isOpen &&
                    <div className="mob_menu">
                        <div className="menu">
                            <div className='top_area'>
                                <div className='x_area'><p>입학안내</p><div className='x' onClick={() => {handleOpenMenu(false);}}><img src='/images/close.png' alt='메뉴닫기'/></div></div>
                                <ul onClick={() => {handleOpenMenu(false);}}>
                                    <li><Link to="https://www.cs.ac.kr/" target="_blank">창신대학교</Link></li>
                                    <li>{loginHTML}</li>
                                </ul>
                            </div>
                            <ul>
                                {menuList?.map((data1, index)=> {
                                    if(data1.DEPTH == 1 && data1.MENU_CD != 54){                                
                                        return (
                                            <li key={index} className='dep1' onClick={() => handleClickMenu(index)}>
                                                <div className={ isClick == index ? 'dep1a curt' :'dep1a'}>{data1.MENU_NM} <img className={ isClick == index ? 'nodeg' :'imgdeg'} src='/images/hd.png' alt='상위메뉴'/></div>
                                                {isClick == index && 
                                                <div className='dep2'>
                                                <ul className="submenu">
                                                    {menuList?.map((data2, index)=> {
                                                        if(data2.DEPTH == 2 && data2.PARENT_MENU_CD == data1.MENU_CD){
                                                            return(
                                                                <li key={index}><Link to={data2.LINK} target={data2.BLANK == "1" ? "_blank":''} onClick={() => {handleOpenMenu(false);}}>{data2.MENU_NM}</Link></li>
                                                        )}
                                                    })}
                                                </ul>
                                                </div>}
                                            </li>
                                    ) }
                                })}
                            </ul>
                        </div>
                    </div>}
                    {/* <ul className='tab topmenu depth1' onMouseEnter={() => setIsMenuHovered(true)} onMouseLeave={() => setIsMenuHovered(false)} onClick={() => setIsMenuHovered(false)}>
                        {menuList?.map((data1, index)=> {
                            if(data1.DEPTH == 1 && data1.MENU_CD != 179){                                
                                return (
                                    <li key={index} className='dep1'><Link to={data1.LINK} onMouseEnter={() => setMenuName(data1.MENU_NM)}>{data1.MENU_NM}</Link>
                                        <ul className='depth2'>
                                            {menuList?.map((data2, index)=> {
                                                if(data2.DEPTH == 2 && data2.PARENT_MENU_CD == data1.MENU_CD){
                                                    return(
                                                        <li key={index}><Link to={data2.LINK} onMouseEnter={() => setMenuName(data1.MENU_NM)}>{data2.MENU_NM}</Link>
                                                            <ul className='depth3' onMouseEnter={() => setMenuName(data1.MENU_NM)}>
                                                                {menuList?.map((data3, index)=> {
                                                                    if(data3.DEPTH == 3 && data3.PARENT_MENU_CD == data2.MENU_CD){
                                                                        return(                                                                    
                                                                                <li key={index}><Link to={data3.LINK}>{data3.MENU_NM}</Link></li>                                                                    
                                                                        )}
                                                                })}
                                                            </ul>
                                                        </li>
                                                )}
                                            })}
                                        </ul>
                                    </li>
                            ) }
                        })}
                    </ul> */}


                    {/*<div onClick={() =>{isOpen ? handleOpenMenu(false): handleOpenMenu(true)}} className='tab topmenu hidden_menu'></div> 
                     {isOpen ? 
                        <div className="hidden_top_menu">
                            <div className="menu">
                                <div className='x_area'><div className='x' onClick={() => {handleOpenMenu(false);setIsHovered(false)}}><img src='/images/close.png' alt='메뉴닫기'/></div></div>
                                <ul className=''>
                                    {menuList?.map((data1, index)=> {
                                        if(data1.DEPTH == 1 && data1.MENU_CD != 54){                                
                                            return (
                                                <li key={index} className='dep1' onClick={() => handleClickMenu(index)}>
                                                    <div className='dep1a'>{data1.MENU_NM} <img className={ isClick == index ? 'nodeg' :'imgdeg'} src='/images/hd.png' alt='상위메뉴'/></div>
                                                    {isClick == index ? 
                                                    <div className='dep2'>
                                                    <ul className="submenu">
                                                        {menuList?.map((data2, index)=> {
                                                            if(data2.DEPTH == 2 && data2.PARENT_MENU_CD == data1.MENU_CD){
                                                                return(
                                                                    <li key={index}><Link to={data2.LINK} onMouseEnter={() => setMenuName(data1.MENU_NM)} onClick={() => {handleOpenMenu(false);setIsHovered(false)}}>{data2.MENU_NM}</Link>
                                                                        
                                                                        {menuList?.map((data3, index)=> {
                                                                            if(data3.DEPTH == 3 && data3.PARENT_MENU_CD == data2.MENU_CD){
                                                                                return(                                                                    
                                                                                        <p className='dep3'><Link  to={data3.LINK} onClick={() => {handleOpenMenu(false);setIsHovered(false)}}>{data3.MENU_NM}</Link></p>                                                                    
                                                                                )}
                                                                        })}
                                                                        
                                                                    </li>
                                                            )}
                                                        })}
                                                    </ul>
                                                    </div>:''}
                                                </li>
                                        ) }
                                    })}
                                </ul>
                            </div>
                        </div> : null} */}
                        
                </div>
                
            </div>
        </header>
        
    )
}

export default Top;