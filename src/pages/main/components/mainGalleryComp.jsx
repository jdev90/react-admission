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
            const res = await fetch(SERVER_URL+'/api/board/178/list',{method:"GET", headers:{'content-type':'application/json'}});
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
        <div className='Maincontain mainGallery'>
            <div className='MainTitle'>
                <p>창신대학교 소식을 생생한 유튜브로</p>
                <h1>CSU<span>홍보영상</span></h1>
                {/* <Link to={"/board/178/list"}><img className='morebtn' src='/images/more.png' alt='행사갤러리 더보기'/></Link> */}
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
                                    <li key={index} style={{transform: `translateX(-${456 * stack}px)` ,transition: 'all 0.4s ease-in-out',}}>  <Link to={"/board/"+data.MENU_CD+"/view?boardId="+data.BOARD_ID}>                                    
                                        <div className='galleryBox'>                                                                                                        
                                            <div className='img'>
                                                <img src={imgSrcPath} alt='행사사진'/>
                                                <div className={'cate cate'+data.CATE}>{data.CATE_NM}</div>
                                            </div>
                                            <div className='txt'><p dangerouslySetInnerHTML={{ __html:  data.TITLE }}></p></div>
                                        </div>
                                    </Link></li> 
                                )
                            }
                        }
                        return(
                            <li key={index} style={{transform: `translateX(-${456 * stack}px)` ,transition: 'all 0.4s ease-in-out',}}><Link to={"/board/"+data.MENU_CD+"/view?boardId="+data.BOARD_ID}>                                        
                                <div className='galleryBox'> 
                                    <div className='img'>
                                        <img src={'https://cfile.cs.ac.kr/upload/fileserver/grad/'+data.MENU_CD+'/'+data.FILE_NAME} alt='행사사진'/>
                                        <div className={'cate cate'+data.CATE}>{data.CATE_NM}</div>
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