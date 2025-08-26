import React, { useState, useEffect, useRef  } from 'react';
import {  Link, useParams, useLocation ,useNavigate  } from 'react-router-dom';
import { SERVER_URL } from "context/config";
import SubBannerComp from 'pages/common/components/subBannerComp';
import SubMenuComp from 'pages/common/components/contentMenuComp';

//**권한**//
import { writePermissionCheck, deletePermissionCheck, getTokenData, getUserRoles } from 'assets/js/jwt';
//**권한**//
const Subject = (props) => {    
    const params = useParams();
	const menuCd = params.menuCd;
    const [subjectList, setSubjectList] = useState([]);
    const [listCnt, setListCnt] = useState([]);
    const containerRef = useRef();

    const [opClicked, setOpClicked] = useState(false);
    const [option, setOption] = useState('search_title');
    const [optionName, setOptionName] = useState('제목');
    const [optionBool, setOptionBool] = useState(false);
    const [input, setInput] = useState('');
    //**권한**//
    const [writePermission, setWritePermission] = useState(false);
    const [deletePermission, setDeletePermission] = useState(false);
    const token = window.sessionStorage.getItem('accessToken'); 
    //**권한**//

    useEffect(() => {
         //**권한**//
        setWritePermission(false);
        setDeletePermission(false);
        if (token) {
            setWritePermission(writePermissionCheck(token, menuCd)); // 권한 확인
            // userData = getTokenData(token); 
        }
        //**권한**//
       Init();
        window.scrollTo(0, 0);
    },[menuCd]);

    useEffect(() => {
        const containerEl = containerRef.current;
        if (containerEl) {
          const scripts = containerEl.getElementsByTagName('script');
          for (const script of scripts) {
            window.eval(script.innerHTML);
          }
        }
     },[subjectList]);
      
    const Init = async () =>{
        try{
            const res = await fetch(SERVER_URL+'/api/board/'+menuCd+'/list?PAGESTART=0&PAGEEND=99999',{method:"GET", headers:{'content-type':'application/json'}});
            const data = await res.json();  
            setSubjectList(data.getBoardList);
            setListCnt(data.totalCnt)
        }catch(e){
            console.log(e);
        }
    }

    {/*검색 옵션*/}
    const getOption = async () => {                        
        const res = await fetch(SERVER_URL+'/api/board/'+menuCd+'/list?SEARCH_TP='+option+'&SEARCH_KEY='+input+"&PAGESTART=0&PAGEEND=99999",{method:"GET", headers:{'content-type':'application/json'}});            
        const data = await res.json();
        setSubjectList(data.getBoardList);
        setOptionBool(true) 
        setListCnt(data.getBoardList.length)
    }
    function enterkey() {
        if (window.event.keyCode == 13){getOption();}
    }
    const handleDelete = async (boardId) => {
        if(window.confirm("삭제된 게시글들은 복구할 수 없습니다.\n게시글을 삭제하시겠습니까?")){

            let JsonArray = new Array();
            let JsonObject = new Object;
            JsonObject.MENU_CD = menuCd;//
            JsonObject.BOARD_ID = boardId;//
            JsonArray.push(JsonObject);
    
            const res = await fetch(SERVER_URL+'/api/board/'+menuCd +'/'+boardId +'/delete', {
                method: "POST",
                headers : {
                    "Content-Type" : "application/json;charset=utf-8;"
                }, 
                body : JSON.stringify(JsonArray)
            });
            const data = await res.json(); 
            if(data?.MSG == "SUCCESS"){
                Init();
            }
        }                
    }
        

    return(
        <>
            <SubBannerComp menuCd={menuCd}/>
            <div className='subcontain'>
                <div className='infocontain'>
                    <div className='contents_area'>
                        <div className='contentBox'>
                        <SubMenuComp/>

                        <div className='noticeTableSearch'>
                            <div className='count'>
                                <img src="/images/sub/board/board1.png"/>
                                <span className='item1'>총게시물 : <em>{listCnt} </em>건</span>
                            </div>                                                 
                            <div className='comm search' onClick={()=>{getOption()}}>검색</div>
                            <input className='comm txtinput' type="text" onChange={(e)=>{setInput(e.target.value)}} value={input} onKeyUp={()=>enterkey()}/>
                            <div className='comm option'>
                                <p onClick={() => opClicked ? setOpClicked(false) : setOpClicked(true)}>{optionName}<img src='/images/sub/board/open.png' alt='검색옵션'/> </p>
                                <ul  className={opClicked ? 'active' : ''} onClick={() => setOpClicked(false)}>
                                    <li onClick={() => {setOption('search_title'); setOptionName('제목')}}>제목</li>
                                    <li onClick={() => {setOption('search_content'); setOptionName('내용')}}>내용</li>
                                    {/* <li onClick={() => {setOption('search_title_content'); setOptionName('제목+내용')}}>제목+내용</li> */}
                                </ul>                            
                            </div>                        
                        </div>
                            {writePermission && 
                           <div className='viewBtn writeBtn'>                            
                              <Link to={"/subject/"+menuCd+"/write"}><div className=''>교과목등록</div></Link>        
                           </div>}

                           {!optionBool && subjectList.length == 0 && <>
                              <div class='contents_none'>
                                <img src="/images/sub/content/contents_none.png"/>
                                <p class="title">자료를 준비하고 있습니다.</p>
                                <p>더 많은 서비스와 정확한 정보를 전해드리기 위해 준비중입니다.</p>
                                <p>이용에 불편을 드려 죄송합니다.</p>                            
                            </div>   
                           </>}

                           {(optionBool && subjectList.length == 0) && <>
                              <div class='contents_none'>
                                <img src="/images/sub/content/contents_none2.png"/>
                                <p class="title">등록된 게시글이 없습니다</p>                                
                              </div>  
                           </>}
                           
                           
                            {subjectList.map((data, index)=> {
                              return(
                                <div className='gaebyeol'>
                                    {writePermission && 
                                    <div className='btn'>                            
                                        <div className='btn1'><Link to={"/subject/"+menuCd+"/write?boardId="+data.BOARD_ID}>수정</Link></div><div className='btn2'><p onClick={()=>handleDelete(data.BOARD_ID)}>삭제</p></div>     
                                    </div>}
                                    <div class="courses">
                                        <p class='courses_n'>{data.TITLE}</p>
                                        <div class='courses_i'><pre>{data.CONTENT}</pre></div>
                                    </div>
                              </div>
                              )
                            })}
                        </div>
                        
                    </div>
                </div>

            </div>
        </>
        
    )
}

export default Subject;