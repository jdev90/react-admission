import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
// import $ from "jquery";
import { SERVER_URL } from "context/config";

const MainGalleryComp = (props) => {
    const [postList, setPostList] = useState([]);
    const [stack, setStack] = useState(0);
    //const [showindex, setShowindex] = useState(9);
    useEffect(() => {        
        Init();
    },[]);

    const Init = async () =>{
        try{
            const res = await fetch(SERVER_URL+'/api/board/572/list',{method:"GET", headers:{'content-type':'application/json'}});
            const data = await res.json();
            setPostList(data?.getBoardList); 
        }catch(e){
            console.log(e);
        }
    }

    function prevBtnClick(){
        {stack != 0 ? setStack(stack-1) : setStack(postList.length-3);}
        //if(stack != 0){setStack(stack-1);}        
    }
    function nextBtnClick(){
        {stack < postList.length-3 ? setStack(stack+1) : setStack(0);}
        //if (stack < showindex-3){setStack(stack+1);}        
    }

    return(                 
        <div className='Maincontain MainGallery'>
            <div className='MainTitle'>
                <p>창신대학교 소식을 생생한 유튜브로</p>
                <h1>CSU<span>홍보영상</span></h1>
                <ul className='Tab'>
                    <li className='vdo'><Link to={"https://www.youtube.com/watch?v=x05iDgSyLIU"} target='_blank' title='창신대학교 홍보영상 유튜브'><div><p>창신대학교</p>2025 홍보영상</div></Link></li>
                    <li className='btn sns2'><div><Link to={"https://www.facebook.com/changshinuniversity"} target='_blank' title='창신대학교 입학 페이스북'></Link></div></li>
                    <li className='btn sns3'><div><Link to={"https://www.instagram.com/changshin_university"} target='_blank' title='창신대학교 입학 인스타그램 '></Link></div></li>
                    <li className='btn more'><div><Link to={"/assistant/video"} title='창신대학교 홍보영상 더보기'></Link></div></li>
                </ul>
            </div> 
            <div className='gallshow'>                 
                <ul className='gallLi'>
                    {postList.map((data, index)=> {            
                        let imgContents = data.CONTENT;  
                        let imgSrcPath = "";
                        let imgPattern = /<img[^>]*src=["']?([^>"']+)["']?[^>]*>/g; //정규식
                        let IMGPattern = /<IMG[^>]*src=["']?([^>"']+)["']?[^>]*>/g; //정규식
                        let imgCaptured;
                        let imgCnt = 0;
                        imgCaptured = imgPattern.exec(imgContents)
                        if(imgCaptured == null) {imgCaptured = IMGPattern.exec(imgContents)}
                        while (imgCaptured != null) {
                            imgSrcPath = imgCaptured[1]; // 첫 번째 이미지 경로 저장
                            imgCnt++;
                            if (imgCnt === 1) {
                                return(
                                    <li key={index} style={{transform: `translateX(-${472 * stack}px)` ,transition: 'all 0.4s ease-in-out',}}>  <Link to={"/board/"+data.MENU_CD+"/view?boardId="+data.BOARD_ID+"&menuId="+data.MENU_CD}>                                    
                                        <div className='galleryBox'>                                                                                                        
                                            <div className='img'>
                                                <img src={imgSrcPath} alt='행사사진'/>
                                            </div>
                                            <div className='txt'><p dangerouslySetInnerHTML={{ __html:  data.TITLE }}></p></div>
                                        </div>
                                    </Link></li> 
                                )
                            }
                        }
                        return(
                            <li key={index} style={{transform: `translateX(-${472 * stack}px)` ,transition: 'all 0.4s ease-in-out',}}><Link to={"/board/"+data.MENU_CD+"/view?boardId="+data.BOARD_ID+"&menuId="+data.MENU_CD}>                                        
                                <div className='galleryBox'> 
                                    <div className='img'>
                                        <img src={'https://cfile.cs.ac.kr/upload/fileserver/admission/'+data.MENU_CD+'/'+data.FILE_NAME} alt='행사사진'/>
                                    </div>
                                    <div className='txt'><p dangerouslySetInnerHTML={{ __html:  data.TITLE }}></p></div>
                                </div></Link> 
                            </li>       
                        )
                    
                    })}                                       
                </ul>
            </div>
            <div className='slideBtn'>
                <div className='prev' onClick={e=>prevBtnClick()}></div>
                <div className='next' onClick={e=>nextBtnClick()}></div>
            </div>
            
        </div>
        
    )
}

export default MainGalleryComp;