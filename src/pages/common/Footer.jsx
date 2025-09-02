import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import URL from '../../context/url';
const Footer = (props) => {
    return(
        <footer>       
            <div className='link'>
                <div className='logo'>
                    <Link><img src='/images/top_logoW.png'/><span className='.home_p_name'>입학안내</span></Link>
                </div>
                <ul>
                    <li><Link to="https://www.cs.ac.kr/document/site3" target='_blank'>개인정보처리방침</Link></li>
                    <li><Link to={URL.SITEMAP}>사이트맵</Link></li>
                </ul>
            </div>
            <div className='m_line'></div>
            <div className='info'>
                <ul>
                    <li><p className='titl'>전화</p><p>신입학 : 055) 250-1200</p><p>편입학 : 055) 250-3104,6</p></li>
                    {/* <li><p className='titl'>팩스</p><p>055) 297-5181</p></li> */}
                    <li><p className='titl'>주소</p><p>경상남도 창원시 마산회원구 팔용로 262, 1호관 1층 입학홍보처</p></li>
                </ul>
                <p>COPYRIGHT (c) CHANGSHIN UNIVERSITY. ALL RIGHTS RESERVED.</p>
            </div>
        </footer>

    )
}

export default Footer;