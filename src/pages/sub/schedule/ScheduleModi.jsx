import React, { useState, useEffect, useRef  } from 'react';
import {  Link, useParams, useLocation ,useNavigate  } from 'react-router-dom';
import { SERVER_URL } from "context/config";
import qs from 'qs';
import SubBannerComp from 'pages/common/components/subBannerComp';

const Sub = (props) => {    
    const params = useParams();
    const menuCd = 175;
    const [contentList, setContentList] = useState([]);
    const containerRef = useRef();
    const location = useLocation();
    const [title, setTitle] = useState("");

    const [start_dt, setStart_dt] = useState('');
    const [end_dt, setEnd_dt] = useState('')

    const query = qs.parse(location.search, {ignoreQueryPrefix: true});
    const q_id = query.id;
    const q_year = query.y;
    const q_hakgi = query.h;

    const navigate = useNavigate();
    useEffect(() => {
        if(query.id !== undefined){
            Init();            
        }
        window.scrollTo(0, 0);
    },[menuCd]);

   
    const Init = async () =>{
        try{
            let JsonArray = new Array();
            let JsonObject = new Object;
            
            JsonObject.YEAR = q_year;
            JsonObject.HAKGI = q_hakgi;
            JsonArray.push(JsonObject);  
            const res = await fetch(SERVER_URL+'/api/schedule/hakgi/list',{method:"POST", headers:{'content-type':'application/json'}, body : JSON.stringify(JsonArray)});
            const data = await res.json();
            modifyContent(data.getScheduleList) ; 
        }catch(e){
            console.log(e);
        }
    }
   
    function modifyContent(list){
        let i;
        for(i=0; i<list.length; i++){
            if(q_id == list[i].ID){
                setTitle(list[i].TITLE);
                setStart_dt(list[i].START_DATE.slice(0,4)+"-"+list[i].START_DATE.slice(4,6)+"-"+list[i].START_DATE.slice(6,8));
                setEnd_dt(list[i].END_DATE.slice(0,4)+"-"+list[i].END_DATE.slice(4,6)+"-"+list[i].END_DATE.slice(6,8));
            }
        }
    }

    const handleSave = async () => {
        let res;
        if(start_dt == undefined || start_dt == '' ){
            alert("날짜를 선택해주세요.");
            return;
        }
        if(title == undefined || title == ''){
            alert("내용을 입력해주세요.");
            return;
        }
        const JsonArray = new Array();
        const formData = new Object();
        formData.START_DATE = start_dt.replaceAll("-", "");
        formData.END_DATE = end_dt.replaceAll("-", "");
        formData.TITLE = title;
        formData.CONTENT = "";
        formData.ACTIVITY = 1;
        formData.USER_ID = "test";
        if(query.id !== undefined){
            formData.ID = query.id;
        }

        JsonArray.push(formData);
        
       
        if(query.id !== undefined){
            res = await fetch(SERVER_URL+'/api/schedule/modify', {method: "POST",eaders : {"Content-Type" : "application/json;charset=utf-8;"},body : JSON.stringify(JsonArray)});}
        else{res = await fetch(SERVER_URL+'/api/schedule/write', {method: "POST",eaders : {"Content-Type" : "application/json;charset=utf-8;"},body : JSON.stringify(JsonArray)});}
        const data = await res.json(); 
        data?.MSG == "SUCCESS" ? navigate('/schedule/list'): console.log('업로드실패');
    }
    

    return(
        <>
            <SubBannerComp menuCd={menuCd}/>
            <div className='subcontain'>
                <div className='infocontain'>
                    <div className='contents_area'>
                        <div className='contentBox'>                           
                            <div class="li_title">
                                <p class="title mgB_12">학사일정 등록</p>
                            </div>
                            <div className='table_area contentsModi'>
                                <table className='comm writeTable'>
                                    <colgroup>
                                        <col width="15%"></col>
                                        <col width="85%"></col> 
                                    </colgroup>
                                    
                                    <tbody>
                                        <tr className='top'>
                                            <td className='title'>시작일</td>  
                                            <td className='borR'><input type="date" value={start_dt} onChange={(e)=>{setStart_dt(e.target.value);}}/></td>
                                        </tr>
                                        <tr>
                                            <td className='title'>마감일</td>  
                                            <td className='borR'><input type="date" value={end_dt} onChange={(e)=>{setEnd_dt(e.target.value);}}/></td>
                                        </tr>                                          
                                        <tr>
                                            <td className='title'>내용</td>  
                                            <td className='txt borR'><input 
                                                className='titleInput' 
                                                type="text"  
                                                required
                                                value={title} 
                                                onChange={(e)=>{setTitle(e.target.value);}} //저장
                                                placeholder='내용을 입력하세요.'/>
                                            </td>                                                                 
                                        </tr>     
                                    </tbody>                    
                                </table>
        
                                <div className='viewBtn viewMarB writeBtn'>
                                    <Link to={'/board/'+menuCd+'/list'}><div className='prev'>취소</div></Link>
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