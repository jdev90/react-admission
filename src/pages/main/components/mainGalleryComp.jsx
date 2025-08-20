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
        <div className='Main mainGallery'>
            <div className='gallTitle'>
                <div className='title'>
                    <h1>행사갤러리</h1>
                    <p>창신대학교 대학원의 행사 사진을 지금 구경해보세요.</p>
                </div>
                <Link to={"/board/178/list"}><img className='morebtn' src='/images/more.png' alt='행사갤러리 더보기'/></Link>
            </div> 
            <div className='gallshow'>                 
                <ul className='gallLi'>
                                        
                    
                    {/* <li style={{transform: `translateX(-${456 * stack}px)` ,transition: 'all 0.4s ease-in-out',}}><Link>                                        
                        <div className='galleryBox'>                                                                                                        
                            <div className='img'><img src="/images/main/galleryTemp.png" alt='행사사진'/><div className='cate cate1'>부동산</div></div>
                            <div className='txt'><p>아아아아ㅏ아아아아아</p></div>
                        </div></Link>
                    </li>  */}
                   
                    
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
                        
                        // const parser = new DOMParser();
                        // const doc = parser.parseFromString(data.CONTENT, 'text/html');
                        // const imgElement = doc.querySelector('img');
                        // const imgSrc = imgElement ? imgElement.src : ''; // 기본 이미지 경로    설정
                                                                       
                        // return(                            
                        //     <li key={index} style={{transform: `translateX(-${456 * stack}px)` ,transition: 'all 0.4s ease-in-out',}}>
                        //         <div className='galleryBox'> 
                        //             <div className='img'><img src={'https://cfile.cs.ac.kr/upload/fileserver/grad'+imgSrc.replaceAll("/wt_board/upload", "")} alt='행사사진'/></div>
                        //             <div className='txt'><p dangerouslySetInnerHTML={{ __html:  data.TITLE }}></p></div>
                        //         </div>
                        //     </li>                     
                        // )
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