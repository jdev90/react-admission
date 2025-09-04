import React, { useState, useEffect, useRef} from 'react';

import {  Link, useParams , useNavigate,useLocation} from 'react-router-dom';
import {SERVER_URL} from 'context/config'; //
import URL from 'context/url';

import SubBannerComp from 'pages/common/components/subBannerComp';
import ContentMenuComp from 'pages/common/components/contentMenuComp';

//**권한**//
import { writePermissionCheck , getTokenData, getUserRoles } from 'assets/js/jwt';
import {getMenuInfo} from "assets/js/utils";
//**권한**//


const List= (props) => {        
    const focusRef = useRef();
    const location = useLocation();
    const navigate = useNavigate(); 
    let menuInfo = getMenuInfo(location.pathname + location.search);

    const getMenucd = () => {
        if(location.pathname.endsWith('/notice')){return '569';}
        else if(location.pathname.endsWith('/talk')){return '570';}
        else if(location.pathname.endsWith('/library')){return '571';}
    };
   // let allnoice_menucd = ; //전체공지 메뉴코드
    const getInitialCate = () => {

        switch (menuInfo?.MENU_CD) {
            case '569':
            case '570':
            case '571': return '';
            case '551':
            case '552':
            case '553': return '1';
            case '556':
            case '557':
            case '558': return '2';
            case '565':
            case '566':
            case '567': return '3';
            case '561':
            case '562':
            case '563': return '4';
            default: return null; 
        }
    };
    const [cate, setCate] = useState();
    const [menuCd, setMenuCd] = useState(getMenucd());

    const [menuList, setMenuList] = useState([]);

    const [menuListCnt, setMenuListCnt] = useState([]);
    const [menuTotalCnt, setMenuTotalCnt] = useState([]);
    const showPostCnt = 10; //최대 10개 게시물 보여짐
    const showpageCnt = 6; //최대 10쪽씩 보여짐
    const [pageIndexClicked, setPageIndexClicked] = useState(0);
    const [pasing, setPasing] = useState([]);   //페이지숫자 
    const [pagingNum, setPagingNum] = useState([0, showpageCnt]);
    const [opClicked, setOpClicked] = useState(false);
    const [option, setOption] = useState('search_title');
    const [optionName, setOptionName] = useState('제목');
    const [input, setInput] = useState('');
    const [pageSt, setPageSt] = useState('');
    const [pageEd, setPageEd] = useState(""); //""

    //**권한**//
    const [writePermission, setWritePermission] = useState(false);
    const token = window.sessionStorage.getItem('accessToken');
    const roles = getUserRoles(token);
    let userData;
    let userDataid;
    const [PWpop, setPWpop] = useState(false);
    const [PW, setPW] = useState('');
    const [PWbool, setPWbool] = useState(false);
    const [board_id, setBoard_id] = useState(''); 

    const listCate = ["공통","수시","정시","편입학","외국인"]; 
    if(token) {userData = getTokenData(token); userDataid = userData.user.id}
    
    //**권한**//
    useEffect(() => {
        //if(menuCd == 176 && !token){ //자료실
        //    navigate("/login?url="+location.pathname)
        //}
        //**권한**//
        setWritePermission(false);
        if (token) {
            setWritePermission(writePermissionCheck(token, menuInfo.MENU_CD)); // 권한 확인
        }
        //**권한**//
       // allnoice_menucd = getMenucd(); //전체공지 메뉴코드
       setMenuCd(getMenucd());
        setCate(getInitialCate())
        setOption('search_title');
        setOptionName('제목');
        setInput('');
        setOpClicked(false);  
        setPageIndexClicked(0);
        setPageSt(0);
        setPageEd(showPostCnt); 
        setPagingNum([0,showpageCnt]);

        window.scrollTo(0, 0);
     
    },[location.pathname]);
    useEffect(() => {
        if(menuCd != ''){
            Init();
        }
    },[cate, menuCd]);



    /*
     useEffect(() => {
        console.log("메뉴코드 변경");
        
    },[menuInfo.MENU_CD]);
    */
   
      
    const Init = async () =>{
        try{
            const res = await fetch(SERVER_URL+'/api/board/'+menuCd+'/list?PAGESTART='+pageSt+'&PAGEEND=10&CATE='+cate, {method: "POST", headers : {"Content-Type" : "application/json;charset=utf-8;"}});
            const data = await res.json();
            setMenuList(data?.getBoardList); 
            setMenuListCnt(data?.totalCnt);
            setMenuTotalCnt(data?.totalCnt);
            setPasing(new Array(data?.totalCnt).fill(null));

        }catch(e){
            console.log(e);
        }
    }

    {/*검색 옵션*/}
    const getOption = async () => { 
        const res = await fetch(SERVER_URL+'/api/board/'+menuCd+'/list?SEARCH_TP='+option+'&SEARCH_KEY='+input+'&PAGESTART='+pageSt+'&PAGEEND=10&CATE='+cate,{method:"GET", headers:{'content-type':'application/json'}});
        const data = await res.json();
        setMenuList(data?.getBoardList);         
        const res2 = await fetch(SERVER_URL+'/api/board/'+menuCd+'/list?SEARCH_TP='+option+'&SEARCH_KEY='+input+'&PAGESTART='+pageSt+'&PAGEEND='+menuTotalCnt+'&CATE='+cate,{method:"GET", headers:{'content-type':'application/json'}});
        const data2 = await res2.json();
        setMenuListCnt(data2?.getBoardList.length); 
    }
    function enterkey() {
        if (window.event.keyCode == 13){getOption();}
    }

    {/*페이징*/}
    function prev(){ 
        if (pagingNum[0]-showpageCnt >=  0){ 
            setPagingNum([pagingNum[0]-showpageCnt, pagingNum[1]-showpageCnt]);
            setPageSt(showPostCnt*(pagingNum[0]-showpageCnt));setPageEd(showPostCnt*((pagingNum[0]-showpageCnt)+1)-1);
            setPageIndexClicked(pagingNum[0]-showpageCnt)
        }  
    }
    function next(){   
        if (pagingNum[0]+showpageCnt <  menuListCnt / showPostCnt ){ 
            setPagingNum([pagingNum[0]+showpageCnt, pagingNum[1]+showpageCnt]);            
            setPageSt(showPostCnt*(pagingNum[0]+showpageCnt));setPageEd(showPostCnt*((pagingNum[0]+showpageCnt)+1)-1);
            setPageIndexClicked(pagingNum[0]+showpageCnt)
        }          
    }
    function prevL(){                 
        setPagingNum([0, showpageCnt]);
        setPageSt(0);setPageEd(showPostCnt);
        setPageIndexClicked(0)
         
    }
    function nextL(){ 
        let num = 0;
        while (num +showpageCnt < menuListCnt / showPostCnt) {num = num + showpageCnt;}        
        setPagingNum([num, num+showpageCnt]);           
        setPageSt(showPostCnt * Math.floor(menuListCnt / showPostCnt));setPageEd(showPostCnt*menuListCnt /showPostCnt -1);
        {Math.floor(menuListCnt / showPostCnt) < menuListCnt / showPostCnt ? setPageIndexClicked( Math.floor(menuListCnt / showPostCnt)) : setPageIndexClicked( Math.floor(menuListCnt / showPostCnt)-1)}  
    }
    const paginga = async () => {
        let res ='';        
        if(pageEd == showPostCnt-1){ res = await fetch(SERVER_URL+'/api/board/'+menuCd+'/list?SEARCH_TP='+option+'&SEARCH_KEY='+input+'&PAGESTART='+pageSt+'&PAGEEND=10&CATE='+cate,{method:"GET", headers:{'content-type':'application/json'}});}              
        else{ res = await fetch(SERVER_URL+'/api/board/'+menuCd+'/list?SEARCH_TP='+option+'&SEARCH_KEY='+input+'&PAGESTART='+pageSt+'&PAGEEND='+pageEd+'&CATE='+cate,{method:"GET", headers:{'content-type':'application/json'}});} 
        const data = await res.json();
        setMenuList(data?.getBoardList);
    }
    
    useEffect(() => {
        paginga();
     },[pageSt,pageEd]);
     
    
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
    useEffect(() => {
        if(PWpop || PWbool) {                 
            focusRef.current.focus();} 
        
    }, [PWpop,PWbool]);

    function PWChkPopup(priv, BOARD_ID){
        if(priv == "1"){
            {writePermission && navigate("/board/"+menuCd+"/view?boardId="+BOARD_ID+"&menuId="+menuInfo?.MENU_CD);}
            setPWpop(true)
            setBoard_id(BOARD_ID);
        }
        else{navigate("/board/"+menuCd+"/view?boardId="+BOARD_ID+"&menuId="+menuInfo?.MENU_CD);}
    }
    const PWChk = async () => {
        let JsonArray = new Array();
        let JsonObject = new Object;
        JsonObject.BOARD_ID = board_id;
        JsonObject.MENU_CD = menuInfo.MENU_CD;
        JsonObject.PASSWD = PW;
        JsonArray.push(JsonObject);
        // let res ='';     
        const res = await fetch(SERVER_URL+'/api/board/'+ board_id+"/passChk",{method:"POST", headers:{'content-type':'application/json'},body : JSON.stringify(JsonArray) });
        const data = await res.json();

        if(data.PASS == 0){
            alert("정확한 비밀번호를 입력해주세요");
            return setPWbool(true);
        }
        else if(data.PASS == 1){
            navigate("/board/"+menuInfo.MENU_CD+"/view?boardId="+board_id+"&menuId="+menuInfo?.MENU_CD);
        }

       
    }
    function enterkey() {
        if (window.event.keyCode == 13){PWChk();}
    }
    

    return(
        <>
            <SubBannerComp menuCd={menuInfo.MENU_CD} />
            <div className='Subcontain'>
                <ContentMenuComp menuCd={menuInfo.MENU_CD}/>                          
                <div className='contentBox'>
                    <div className='table_area'>
                        <div className='noticeTableSearch'>  
                            <div className='count'>
                                <img src="/images/sub/board/board1.png"/>
                                <span className='item1'>총게시물 : <em>{menuListCnt} </em>건</span>
                                <span>페이지 : <em>{pageIndexClicked+1}</em> / {Math.ceil(menuListCnt/showPostCnt)}</span>
                            </div>
                                                                      
                            <div className='comm search' onClick={()=>{getOption()}}>검색</div>
                            <input className='comm txtinput' type="text" onChange={(e)=>{setInput(e.target.value)}} value={input} onKeyUp={()=>enterkey()}/>
                            <div className='comm option'>
                                <p onClick={() => opClicked ? setOpClicked(false) : setOpClicked(true)}>{optionName}<img src='/images/sub/board/open.png' alt='검색옵션'/> </p>
                                <ul  className={opClicked ? 'active' : ''} onClick={() => setOpClicked(false)}>
                                    <li onClick={() => {setOption('search_title'); setOptionName('제목')}}>제목</li>
                                    <li onClick={() => {setOption('search_content'); setOptionName('내용')}}>내용</li>
                                    <li onClick={() => {setOption('search_title_content'); setOptionName('제목+내용')}}>제목+내용</li>
                                </ul>                            
                            </div>                        
                        </div>
                    
                        
                        
                        <div className="is-wauto-box">
                            <table className='comm listTable'>
                                <colgroup>
                                    <col width="7%"></col>
                                    <col width="auto"></col>
                                    <col width="6%"></col>
                                    <col width="16%"></col>
                                    <col width="10%"></col>
                                </colgroup>
                                <thead>                                
                                    <tr>
                                        <th>번호</th>
                                        <th>제목</th>
                                        <th>파일</th>
                                        <th>작성일</th>
                                        <th className='borR'>조회수</th>
                                    </tr>
                                </thead>
                                <tbody> 
                                {menuList.map((data, index)=> {
                                    const isnew = newFunc(data.CREATE_DT);  
                                        return (                                                                    
                                            <tr key={index}>
                                                {data?.NOTICE != '1' ?<td>{data.NO}</td>:<td><div className='notice'>공지</div></td>}{/*menuListCnt-pageSt-index*/}
                                                <td className="txtleft" onClick={() => PWChkPopup(data.PRIVACY, data.BOARD_ID)}>
                                                    {data.CATE !="" && <div className={'cate cate'+data.CATE}>{listCate[data.CATE]}</div>}
                                                    <Link className={data?.NOTICE == '1' && 'noti_a'} ><p dangerouslySetInnerHTML={{ __html:  data.REPLY_CNT > 0 ? data.TITLE+' ['+data.REPLY_CNT+']' : data.TITLE}} /></Link>                                                    
                                                    {/* {data.FILE_NAME != "" ?<img src='/images/sub/down.png' alt='첨부파일 있음'/>:null } */}
                                                    {data?.PRIVACY == "1" ?<img src='/images/sub/lock.png' alt='비밀글'/>:null }
                                                    {isnew ? <div className='new'>N</div>:null}
                                                    
                                                </td>  
                                                {data.FILE_NAME != "" ?<td className='file_img'><img src='/images/sub/down.png' alt='첨부파일 있음'/></td>  : <td></td> }                                  
                                                <td>{data.CREATE_DT.slice(0,11)}</td>
                                                <td className='borR'>{data.HIT}</td>
                                            </tr>
                                        )
                                })}       
                                {menuList.length === 0 && <tr><td className="nonepost borR" colSpan={5}>등록된 게시글이 없습니다.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        <div className='viewBtn writeBtn'>
                            {/* {writePermission || user_write == 1 ? <Link to={"/board/"+menuCd+"/write"}><div className=''>글쓰기</div></Link>  :null}  */}
                            {writePermission || menuInfo?.USER_WRITE == 1 ? <Link to={"/board/"+menuCd+"/write?url="+location.pathname}><div className=''>글쓰기</div></Link>  :null} 

                        </div>
                        
                        { menuListCnt > showPostCnt+1 ? 
                            <div className='paging' >                           
                                {(menuListCnt / showPostCnt) > showpageCnt && pagingNum[0] != 0? 
                                    <>
                                    <span className='com btnL prevL' onClick={()=>{prevL()}}><img src='/images/sub/board/page.png' alt='맨 처음 게시글 리스트'/></span>
                                    <span className='com btn prev' onClick={()=>{prev()}}>이전</span>
                                    </>
                                :null}
                                <ul className='com'>
                                    {pasing.map((data, index)=> {                             
                                        if(index < menuListCnt / showPostCnt &&  index >= pagingNum[0] && index < pagingNum[1]){                                                         
                                        return(                                      
                                            <li key={index} className={pageIndexClicked == index ? 'num active' : 'num'}  onClick={()=>{setPageSt(showPostCnt*index);setPageEd(showPostCnt*(index+1)-1);setPageIndexClicked(index)}}><div>{index+1}</div></li>
                                        )}
                                    })}
                                </ul>
                                {(menuListCnt / showPostCnt) > showpageCnt && pagingNum[1] <  menuListCnt / showPostCnt ?
                                    <>
                                    <span className='com btn next' onClick={()=>{next()}}>다음</span> 
                                    <span className='com btnL nextL' onClick={()=>{nextL()}}><img src='/images/sub/board/page.png' alt='맨 마지막 게시글 리스트'/></span>
                                    </>
                                :null}
                            </div>
                        : null}


                        {PWpop && 
                        <div className='pw_popup_back'>
                            <div className='pw_popup'> 
                                <div className='back' onClick={()=>{setPWpop(false);setPW("");setPWbool(false)}}><img src='/images/main/comm_more.png'/></div>                           
                                <h3>게시물 인증</h3>
                                {PWbool ? <p className='color'>비밀번호를 다시 입력해주세요.</p> : <p>비밀번호 확인</p>}
                                <input  
                                    type="password"  
                                    // value={PW} 
                                    onChange={(e)=>{setPW(e.target.value);}} //저장
                                    onKeyUp={()=>enterkey()}
                                    ref={focusRef}
                                    placeholder="비밀번호를 입력해 주세요."
                                    />
                                <div className='btn' style={{textAlign:"center"}}><div className="O" onClick={()=>{setPWpop(false);setPW("");setPWbool(false)}}>취소</div><div onClick={()=>PWChk()}>확인</div></div>                            
                            </div>
                        </div>
                        }
                        
                    </div>
                
                </div>

            </div>
        </>
        
    )
}

export default List;