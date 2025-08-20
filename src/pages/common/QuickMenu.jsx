import React, { useState, useEffect } from 'react';
import {  Link, useParams } from 'react-router-dom';



const QuickMenu= (props) => {    
   
    const [servMore, setServMore] = useState(false);
	const menuCd = props.menuCd ; 
    useEffect(() => {
        // (menuCd)
        setServMore(false)
    },[menuCd]);

    return(
        <>
        <div id="sideQuickM">
            <div className='quick'>
                <ul>
                    <li><Link to={"https://cs.certpia.com/"} target='_blank' title=''><div><img src='/images/main/quick_m_1.png' alt=''/><p>인터넷<br></br>증명서</p></div></Link></li>
                    <li><Link to={"https://lms.cs.ac.kr/"} target='_blank' title=''><div><img src='/images/main/quick_m_2.png' alt=''/><p>스마트<br></br>LMS</p></div></Link></li>
                    <li><Link to={"https://tisc.cs.ac.kr/tisc/index.html"} target='_blank' title=''><div><img src='/images/main/quick_m_3.png' alt=''/><p>학생포털</p></div></Link></li>
                    <li><Link to={"/board/163/list"} title=''><div><img src='/images/main/quick_m_4.png' alt=''/><p>입학<br></br>공지사항</p></div></Link></li>
                </ul>
            </div>
            <div className='menu' onClick={()=>setServMore(true)}><p>주요<br></br>서비스</p></div>
        </div>
        {servMore && 
            <div id="serv_more_back">
                <div id="serv_more">
                    <div className="top"> 
                        <h1>대학원 주요서비스</h1>
                        <div onClick={()=>setServMore(false)}><img className='back' src="/images/sub/content/p_close.png"/></div>
                    </div>
                    <div className="menuList"> 
                        <ul>
                            <li><div><Link to={"https://tisc.cs.ac.kr/tisc/index.html"} target='_blank'><img src="/images/main/quick1.png"/><p>학생포털</p></Link></div></li>
                            <li><div><Link to={"https://cs.certpia.com/"} target='_blank'><img src="/images/main/quick2.png"/><p>인터넷증명서</p></Link></div></li>
                            <li><div><Link to={"https://lms.cs.ac.kr/"} target='_blank'><img src="/images/main/quick3.png"/><p>스마트LMS</p></Link></div></li>
                            <li><div><Link to={"https://rule.cs.ac.kr/"} target='_blank'><img src="/images/main/quick4.png"/><p>규정류관리시스템</p></Link></div></li>
                            <li><div><Link to={"https://lib.cs.ac.kr/"} target='_blank'><img src="/images/main/quick5.png"/><p>도서관</p></Link></div></li>
                            <li><div onClick={()=>setServMore(false)}><Link to={"/board/174/list"}><img src="/images/main/quick6.png"/><p>공지사항</p></Link></div></li>
                            <li><div onClick={()=>setServMore(false)}><Link to={"/board/163/list"}><img src="/images/main/quick7.png"/><p>입학공지사항</p></Link></div></li>
                            <li><div onClick={()=>setServMore(false)}><Link to={"/contents/66/view"}><img src="/images/main/quick8.png"/><p>오시는 길</p></Link></div></li>
                        </ul>
                    </div>
                </div>
            </div>
        }
        </>
    )
}

export default QuickMenu;