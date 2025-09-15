import React, { useState, useEffect } from 'react';
import {  Link, useLocation } from 'react-router-dom';
import qs from 'qs';
import { SERVER_URL } from "context/config";
const MainNoticeComp = (props) => {
    const [postList, setPostList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [menucd, setMenucd] = useState(569);
    const [cate, setCate] = useState("");
    const listCate = ["공통","수시","정시","편입학","외국인"]; 
    const noticeUrlList = ["/assistant/notice","/early/notice","/regular/notice","/transfer/notice","/international/notice"]; 

    //const location = useLocation();
    // const today = new Date();
    // const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
    // const year = today.getFullYear();
    useEffect(() => {
        Init();
    },[]);

    const Init = async () =>{
        try{
            getBoard();         
            setLoading(true);            
            
        }catch(e){
            console.log(e);
        }
    }

    const getBoard = async () => {
        const res = await fetch(SERVER_URL+'/api/board/569/list?CATE='+cate,{method:"GET", headers:{'content-type':'application/json'}});
        const data = await res.json();
        setPostList(data?.getBoardList);
    }
    function newFunc(postDate){
        // 날짜 문자열을 Date 객체로 변환 (yyyyMMdd 형식에서 Date로 변환)
        const start = new Date(`${postDate.slice(0, 4)}-${postDate.slice(5, 7)}-${postDate.slice(8, 10)}`);
        const today = new Date(); // 현재 날짜        
        const diffTime = today - start;// 날짜 차이를 계산 (밀리초 단위)       
        const diffDays = diffTime / (1000 * 60 * 60 * 24);// 밀리초를 일수로 변환        
        
        if (diffDays >= 7) { // 차이가 7일 이상
             return false;}       
        else{ return true;}
    }
    

    function tabClick(menucd){           
        setMenucd(menucd);  
    }

    useEffect(() => {
        getBoard(); 
    },[menucd]);


    return(                 
        <div className='Maincontain MainNotice'>
            <div className='MainTitle'>
                <p>창신대학교 입시 소식을 확인할 수 있습니다.</p>
                <h1>CSU<span>공지사항</span></h1>  
                <ul className='Tab'>
                    <li onClick={e => (tabClick(569),setCate(''))} className={ 569 == menucd  ? "on" : "" }>전체</li>
                    <li onClick={e => (tabClick(551),setCate(1))} className={ 551 == menucd  ? "on" : "" }>수시</li>
                    <li onClick={e => (tabClick(556),setCate(2))} className={ 556 == menucd  ? "on" : "" }>정시</li>
                    <li onClick={e => (tabClick(565),setCate(3))} className={ 565 == menucd  ? "on" : "" }>편입학</li>
                    <li onClick={e => (tabClick(561),setCate(4))} className={ 561 == menucd  ? "on" : "" }>외국인</li>
                    <li className='more'><Link to={cate == '' ? noticeUrlList[0] :noticeUrlList[cate]}><img src='/images/main/comm_more.png'/></Link></li>
                </ul>              
            </div>

            <ul className='notiContent'>
            {postList.map((data, index)=> {                                                      
                    if(index < 5){
                        const isnew = newFunc(data.CREATE_DT);                          
                        return(
                            <li>
                                <Link to={"/board/"+data.MENU_CD+"/view?boardId="+data.BOARD_ID+"&menuId="+menucd}>
                                    <div className='title'>
                                        <span className={'cata cate'+data.CATE}>{listCate[data.CATE]}</span>
                                        {data.NOTICE && <span className='noti'>공지</span>}
                                        {data.TITLE}
                                        {isnew && <div className='new'>N</div>}
                                    </div>
                                    <span className='date'>{data.CREATE_DT.slice(0,10)}</span>
                                </Link>
                            </li>
                        )
                    }
                })}
                {postList.length === 0 && <li className="nopost">등록된 게시물이 없습니다.</li>} 
            </ul>
        </div>
        
        
    )
}

export default MainNoticeComp;