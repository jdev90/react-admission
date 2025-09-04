import React, { useState, useEffect } from 'react';
import {  Link, useParams,useLocation } from 'react-router-dom';
import {SERVER_URL} from 'context/config'; //

import SubBannerComp from 'pages/common/components/subBannerComp';
import ContentMenuComp from 'pages/common/components/contentMenuComp';

//**권한**//
import { writePermissionCheck } from 'assets/js/jwt';
//**권한**//

const Grid = (props) => {    
    const location = useLocation();
	const menuCd = '572'; //임의 menucd int X  string O 
   // const [boardList, setBoardList] = useState([]);
    const [menuList, setMenuList] = useState("");
    const [postList, setPostList] = useState([]);

    const [menuListCnt, setMenuListCnt] = useState([]);
    const [menuTotalCnt, setMenuTotalCnt] = useState([]);
    const showPostCnt = 9; //최대 9개 게시물 보여짐
    const showpageCnt = 10; //최대 10쪽씩 보여짐
    const [pageClicked, setPageIndexClicked] = useState(0);
    const [pasing, setPasing] = useState([]);    
    const [pagingNum, setPagingNum] = useState([0, showpageCnt]);
    const [pageSt, setPageSt] = useState('');
    const [pageEd, setPageEd] = useState('');    

    const [opClicked, setOpClicked] = useState(false);
    const [option, setOption] = useState('search_title');
    const [optionName, setOptionName] = useState('제목');
    const [input, setInput] = useState('');
    //**권한**//
        const [writePermission, setWritePermission] = useState(false);
        const token = window.sessionStorage.getItem('accessToken');
    //**권한**//
    
    useEffect(() => {
        //**권한**//
        setWritePermission(false);
        if (token) {
            setWritePermission(writePermissionCheck(token, menuCd)); // 권한 확인
        }
        //**권한**//

        setOption('search_title');
        setOptionName('제목');
        setInput('');
        setOpClicked(false);
        setPageSt(0);
        setPageEd(showPostCnt);
        setPagingNum([0, showpageCnt]);
        setPageIndexClicked(0); 
        Init();
        
        window.scrollTo(0, 0);
    },[menuCd]);
      
    const Init = async () =>{
        try{
            const res = await fetch(SERVER_URL+'/api/board/'+menuCd+'/list',{method:"GET", headers:{'content-type':'application/json'}});
            const data = await res.json();
            setPostList(data?.getBoardList);
            //setMenuList(data?.getBoardList);
            setMenuListCnt(data?.totalCnt); 
            setMenuTotalCnt(data?.totalCnt);
            setPasing(new Array(data?.totalCnt).fill(null));
        }catch(e){
            console.log(e);
        }
    }



    const getOption = async () => {
        const res = await fetch(SERVER_URL+'/api/board/'+menuCd+'/list?SEARCH_TP='+option+'&SEARCH_KEY='+input+'&PAGESTART='+pageSt+'&PAGEEND='+pageEd,{method:"GET", headers:{'content-type':'application/json'}});
        const data = await res.json();
        setPostList(data?.getBoardList);
        const res2 = await fetch(SERVER_URL+'/api/board/'+menuCd+'/list?SEARCH_TP='+option+'&SEARCH_KEY='+input+'&PAGESTART='+pageSt+'&PAGEEND='+menuTotalCnt,{method:"GET", headers:{'content-type':'application/json'}});
        const data2 = await res2.json();
        setMenuListCnt(data2?.getBoardList.length); 
    }
    function enterkey() {
        if (window.event.keyCode == 13){getOption();}
    }

    function prev(){ 
        if (pagingNum[0]-showpageCnt >=  0){ 
            setPagingNum([pagingNum[0]-showpageCnt, pagingNum[1]-showpageCnt]);
            setPageSt(showPostCnt*(pagingNum[0]-showpageCnt));setPageEd(showPostCnt*((pagingNum[0]-showpageCnt)+1)-1);
            setPageIndexClicked(pagingNum[0]-showpageCnt)
        }  
    }
    function next(){ 
        if (pagingNum[0]+showpageCnt <  menuListCnt / showPostCnt){ 
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
        while (num + showpageCnt < menuListCnt / showPostCnt) {num = num + showpageCnt;}    
        setPagingNum([num, num+showpageCnt]);            
        setPageSt(showPostCnt * Math.floor(menuListCnt / showPostCnt));setPageEd(showPostCnt*menuListCnt /showPostCnt);
        {Math.floor(menuListCnt / showPostCnt) < menuListCnt / showPostCnt ? setPageIndexClicked( Math.floor(menuListCnt / showPostCnt)) : setPageIndexClicked( Math.floor(menuListCnt / showPostCnt)-1)}  
    }
    const paginga = async () => {
        let res='';
        if(pageEd == showPostCnt-1){res = await fetch(SERVER_URL+'/api/board/'+menuCd+'/list?SEARCH_TP='+option+'&SEARCH_KEY='+input+'&PAGESTART='+pageSt+'&PAGEEND=9',{method:"GET", headers:{'content-type':'application/json'}});}
        else{res = await fetch(SERVER_URL+'/api/board/'+menuCd+'/list?SEARCH_TP='+option+'&SEARCH_KEY='+input+'&PAGESTART='+pageSt+'&PAGEEND='+pageEd,{method:"GET", headers:{'content-type':'application/json'}});}
        const data = await res.json();
        setPostList(data?.getBoardList);

    }
    useEffect(() => {        
     },[postList]);

    useEffect(() => {        
        if(postList?.length > 0){
            paginga();
         }
     },[pageSt,pageEd]);

     if (!Array.isArray(postList)) {
        return <div style={{height:"1000px"}}></div>
    } 
    return(
        <>
            <SubBannerComp menuCd={menuCd}/>
            <div className='Subcontain'>
                <ContentMenuComp menuCd={menuCd}/>                          
                    <div className='contentBox'>
                    <div className='table_area'>
                        <div className='noticeTableSearch' style={{width:"96%"}}> 
                            <div className='count'>
                                <img src="/images/sub/board/board1.png"/>
                                <span className='item1'>총게시물 : <em>{menuListCnt} </em>건</span>
                                <span>페이지 : <em>{pageClicked+1}</em> / {Math.ceil(menuListCnt/showPostCnt)}</span>
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
                    
                        <ul className={opClicked ? 'comm galleryTable active' : 'comm galleryTable'}>
                            {postList?.map((data, index)=> {                            
                                let imgContents = data.CONTENT;  
                                let imgSrcPath = "";
                                let imgPattern = /<img[^>]*src=["']?([^>"']+)["']?[^>]*>/g; //정규식
                                let IMGPattern = /<IMG[^>]*src=["']?([^>"']+)["']?[^>]*>/g; //정규식
                                let imgCaptured;
                                let imgCnt = 0;
                                let img = 1 ; 
                                imgCaptured = imgPattern.exec(imgContents)
                                if(imgCaptured == null) {imgCaptured = IMGPattern.exec(imgContents)} 
                                // while ((imgCaptured = imgPattern.exec(imgContents)) !== null || (imgCaptured = IMGPattern.exec(imgContents)) !== null) {
                                while (imgCaptured != null) {
                                    imgSrcPath = imgCaptured[1]; // 첫 번째 이미지 경로 저장
                                    imgCnt++;    
                                    if (imgCnt === 1) {                                    
                                        return (    
                                            <li><div className='grid'> 
                                                {data.CATE_NM && <div className={'cate cate'+data.CATE}>{data.CATE_NM}</div>}
                                                <Link to={"/board/"+menuCd+"/view?boardId="+data.BOARD_ID+"&menuId="+menuCd}>
                                                    <div className='img'><img src={imgSrcPath} alt='행사사진'/></div>                                                        
                                                    <div className='txt'>
                                                        <div className='title' dangerouslySetInnerHTML={{ __html:  data.TITLE }}></div>
                                                        <span><img src='/images/sub/board/gall2.png' alt='작성일'/>{data.CREATE_DT.slice(0,11)}</span>
                                                        <span className='hit'><img src='/images/sub/board/gall1.png' alt='조회수'/>{data.HIT}</span>                                                            
                                                    </div>
                                                </Link>
                                            </div></li>                            
                                    )}
                                }
                                return ( 
                                    <li><div className='grid'>
                                        {data.CATE_NM && <div className={'cate cate'+data.CATE}>{data.CATE_NM}</div>}
                                        <Link to={"/board/"+menuCd+"/view?boardId="+data.BOARD_ID+"&menuId="+menuCd}>
                                            <div className='img'><img src={img ? 'https://cfile.cs.ac.kr/upload/fileserver/admission/'+data.MENU_CD+'/'+data.FILE_NAME : "/images/main/galleryTemp.png"} alt='행사사진'/></div>
                                            <div className='txt'>
                                                <div className='title' dangerouslySetInnerHTML={{ __html:  data.TITLE }}></div>
                                                <span><img src='/images/sub/board/gall2.png' alt='작성일'/>{data.CREATE_DT.slice(0,11)}</span>
                                                <span className='hit'><img src='/images/sub/board/gall1.png' alt='조회수'/>{data.HIT}</span>
                                            </div>
                                        </Link>
                                    </div></li>
                                )  
                            })}                         
                        </ul>

                        {writePermission ? 
                        <div className='viewBtn writeBtn'>
                            {/* <Link to={"/borad/"+menuCd+"/write"}><div className=''>글쓰기</div></Link>   */}
                            <Link to={"/board/"+menuCd+"/write?url="+location.pathname}><div className=''>글쓰기</div></Link>                  
                        </div>:null}
                        
                        {menuListCnt >10 ? 
                            <div className='paging' >
                                {(menuListCnt / showPostCnt) > showpageCnt && pagingNum[0] != 0? 
                                    <>
                                    <span className='com btnL prevL' onClick={()=>{prevL()}}><img src='/images/sub/board/page.png' alt='맨 처음 게시글 리스트'/></span>
                                    <span className='com btn prev' onClick={()=>{prev()}}><img src='/images/sub/board/open.png' alt='앞 게시글 리스트'/></span>
                                    </>
                                :null}
                                <ul className='com'>{pasing.map((data, index)=> {                             
                                        if(index < menuListCnt / showPostCnt &&  index >= pagingNum[0] && index < pagingNum[1]){                                                         
                                        return(                                      
                                            <li className={pageClicked == index ? 'num active' : 'num'}  onClick={()=>{setPageSt(showPostCnt*index);setPageEd(showPostCnt*(index+1)-1);setPageIndexClicked(index)}}><div>{index+1}</div></li>
                                        )}
                                    })}
                                </ul>
                                {(menuListCnt / showPostCnt) > showpageCnt && pagingNum[1] <  menuListCnt / showPostCnt ?
                                    <>
                                    <span className='com btn next' onClick={()=>{next()}}><img src='/images/sub/board/open.png' alt='다음 게시글 리스트'/></span>
                                    <span className='com btnL nextL' onClick={()=>{nextL()}}><img src='/images/sub/board/page.png' alt='맨 마지막 게시글 리스트'/></span>
                                    </>
                                :null}
                            </div> 
                        :null}
                    </div>

                </div>
            </div>
        </>
        
    )
}

export default Grid;