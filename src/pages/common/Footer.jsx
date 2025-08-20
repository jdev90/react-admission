import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import URL from '../../context/url';
const Footer = (props) => {
    return(
        <footer>       
            <div className='Bottom'>
                <div className='BSap BSap2'>
                    <ul className='col linkTab'>
                        <li className='documentSite'><Link to={"https://www.cs.ac.kr/document/site3"} target="_blank">개인정보처리방침</Link></li>
                        <li><Link to={"https://www.cs.ac.kr/document/site4"} target="_blank">영상정보처리기기운영</Link></li>
                        {/* <li><Link to={"/contents/57"}>저작권보호정책</Link></li>
                        <li><Link to={"/contents/57"}>이메일무단수집거부</Link></li> */}
                    </ul>
                    <ul className='col sns'>
                        <li><Link to={"https://www.facebook.com/changshinuniversity"} target='_blank' title='창신대학교 대학원 페이스북'><img src='/images/sns1.png' alt='페이스북'/></Link></li>
                        <li><Link to={"https://www.instagram.com/changshin_university"} target='_blank' title='창신대학교 대학원 인스타그램'><img src='/images/sns2.png' alt='인스타그램'/></Link></li>
                    </ul>
                </div>
                <div className='BSap'>
                    <div className='col address'>
                        <p>51352 경상남도 창원시 마산회원구 팔용로 262 9호관 5층</p>
                        <p>Tel. 055) 250 - 3152~3, 3159 <span>Fax. 055) 250 - 3154</span></p>
                        <p className="copyright">Copyright (c) Changshin University. All Rights Reserved. </p>
                    </div>
                </div>
            </div>
        </footer>

    )
}

export default Footer;