import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import SubBannerComp from 'pages/common/components/subBannerComp';
const Error = (props) => {
    return(
        <>
            <SubBannerComp/>
            <div className='subcontain'>
                <div style={{lineHeight:"200px", fontSize:"26px", fontWeight:"500"}}></div>
            </div>
        </>

    )
}

export default Error;