import React, { useState, useEffect, useRef  } from 'react';
import {  Link, useParams, useLocation ,useNavigate  } from 'react-router-dom';
import { SERVER_URL } from "context/config";
import qs from 'qs';

import SubBannerComp from 'pages/common/components/subBannerComp';

///////
const Sub = (props) => {    
    const params = useParams();
    const menuCd = params.menuCd;
    const location = useLocation();  
    const query = qs.parse(location.search, {ignoreQueryPrefix: true});
    
    const [contentList, setContentList] = useState([]);
    const containerRef = useRef();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [save, setSave] = useState("");
        

    const navigate = useNavigate();
    //const token = window.sessionStorage.getItem('accessToken');
    useEffect(() => {
        if(query.boardId !== undefined){
            Init();
        }
        window.scrollTo(0, 0);
    },[menuCd]);

         
    const Init = async () =>{
        try{
            const res = await fetch(SERVER_URL+'/api/board/'+menuCd +'/'+query.boardId +'/view',{method: "POST", headers : {"Content-Type" : "application/json;charset=utf-8;" }});
            const data = await res.json();            
            setContent(data.getBoardView[0]?.CONTENT);
            setTitle(data.getBoardView[0]?.TITLE); //제목 가져옴             
            
        }catch(e){
            console.log(e);
        }
    }
    const handleSave = async () => {
        if(title == undefined || title == '' ){
            alert("교과목명을 입력해주세요.");
            return;
        }
        if(content == undefined || content == ''){
            alert("교과목설명을 입력해주세요.");
            return;
        }

        const formData = new FormData();
       
        // if(query.boardId !== undefined){
        //     formData.append('BOARD_ID', query.boardId);
        // }
        if(query.boardId !== undefined){
            formData.append('BOARD_ID', query.boardId);
        }
        formData.append('TITLE', title);
        formData.append('CATE', "");
        formData.append('PRIVACY', "0");
        formData.append('CONTENT', content);
        formData.append('MENU_CD', menuCd);
        formData.append('USER_ID', "test");//userData.user.id
        formData.append('NOTICE', "0");
        formData.append('PASSWD', "");
        formData.append('PRIVACY', "");


       
        const res = await fetch(SERVER_URL+'/api/board/'+menuCd+'/write', {method: "POST",
            headers: {
              //'Content-Type': 'multipa rt/form-data',
            },
            body : formData
        });
        const data = await res.json(); 
        data?.MSG == "SUCCESS" ?  navigate('/subject/'+menuCd+"/list"): console.log('업로드실패');
    }

    
    
   
        

    return(
        <>
            <SubBannerComp menuCd={menuCd}/>
            <div className='subcontain'>
                <div className='infocontain'>
                    <div className='contents_area'>
                        <div className='contentBox'>                           
                            <div class="li_title">
                                <p class="title mgB_12">교과목 등록</p>
                            </div>
                            <div className='table_area contentsModi'>
                                <table className='comm writeTable'>
                                    <colgroup>
                                        <col width="15%"></col>
                                        <col width="85%"></col> 
                                    </colgroup>
                                    
                                    <tbody>
                                        <tr className='top'>
                                            <td className='title'>교과목명</td>  
                                            <td className='txt borR'><input 
                                                className='titleInput' 
                                                type="text"  
                                                required
                                                value={title} 
                                                onChange={(e)=>{setTitle(e.target.value);}} //저장
                                                placeholder='교과목명을 입력하세요.'/>
                                            </td>                                                                  
                                        </tr> 
                                        
                                         
                                        <tr>
                                            <td className='title'>교과목설명</td>  
                                            <td className='txt borR'><textarea
                                                className='titleInput' 
                                                type="text"  
                                                required
                                                value={content} 
                                                onChange={(e)=>{setContent(e.target.value);}} //저장
                                                placeholder='내용을 입력하세요.'/>
                                            </td>                                                                
                                        </tr>                                                    
                                        
                                    </tbody>                    
                                </table>
        
                                <div className='viewBtn viewMarB writeBtn'>
                                    <Link to={'/subject/'+menuCd+"/list"}><div className='prev'>취소</div></Link>
                                    <div className='next' onClick={()=> handleSave()}>저장</div>                       
                                </div>
                            </div>                         

                           

                        </div>
                        
                    </div>
                </div>

            </div>
        </>
        
    )
}

export default Sub;