import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import qs from 'qs';
import {SERVER_URL} from '../../context/config'; //

import SubBannerComp from '../common/components/subBannerComp';
const Login = (props) => {
    const location = useLocation();
    const query = qs.parse(location.search, {ignoreQueryPrefix: true});
    const boardId = query.boardId;
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();
    const focusRef = useRef();

    const handleLogin = async () => {
        let JsonArray = new Array();
        let JsonObject = new Object;
        JsonObject.USER_ID = id;//
        JsonObject.PASSWD = pw; //
        JsonArray.push(JsonObject);

        const res = await fetch(SERVER_URL+"/api/user/login", {method: "POST", headers : {"Content-Type" : "application/json;charset=utf-8;"}, body : JSON.stringify(JsonArray)});
        const data = await res.json(); 

        if(data.MSG === "SUCCESS"){
          //  const payload = res.headers.get('accesstoken'); // 페이로드 추출
            window.sessionStorage.setItem("accessToken", res.headers.get('accessToken'));
            setIsLogin(true);
        }else{
            alert(data.MSG);
            setPw("");
        }
    }

    useEffect(() => {//
        if(isLogin){
            //navigate(query.url); //로그인하기 바로 전 페이지로 이동

            if(query.boardId){navigate(query.url+"?boardId="+query.boardId+"&menuId="+query.menuId);}    
            else{navigate(query.url);}
        }
    },[isLogin]);

    
    const Init = async () =>{
        try{
            focusRef.current.focus();

        }catch(e){
            console.log(e);
        }
    }

    useEffect(() => {            
        Init();
    },[]);  

    function enterkey() {
        if (window.event.keyCode == 13) {
            // 엔터키가 눌렸을 때
            handleLogin();
        }
    }
    
    return(
        <>
            <SubBannerComp menuCd={null}/>
            <div className='noneContentMenu-box'>
                <div className='logintitle'><p>로그인</p></div>
                <div className='loginbox'>
                    <div className="cslogo"><img src='/images/sub/login/cslogo.png' alt='창신대학교 로고'/></div>
                    <div className='login'>                        
                            <div className='id'><img src='/images/sub/login/id.png' alt='아이디'/><input onChange={(e)=>{setId(e.target.value)}} placeholder='학번(교직번) (ID No.)' ref={focusRef}/></div>
                            <div><img src='/images/sub/login/pw.png' alt='비밀번호'/><input onChange={(e)=>{setPw(e.target.value)}} type="password" value={pw} onKeyUp={()=>enterkey()} placeholder='비밀번호 (Password)'  /></div>
                            <div className='loginbtn' onClick={()=> handleLogin()}>로그인</div>  
                            <div className='txt'>※ 종합정보시스템 계정으로 로그인하시기 바랍니다.</div>                          
                        </div>
                </div>
                
            </div>
        </>
        
    )
}

export default Login;