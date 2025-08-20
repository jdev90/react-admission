import React, { useState, useEffect } from 'react';
import {  Link, useParams,useNavigate  } from 'react-router-dom';
import {SERVER_URL} from 'context/config'; //
import URL from 'context/url';

import SubBannerComp from 'pages/common/components/subBannerComp';

//**권한**//
import { writePermissionCheck, deletePermissionCheck, getTokenData, getUserRoles } from 'assets/js/jwt';
//**권한**//


const Schedule= (props) => {    
    //**권한**//
    const [writePermission, setWritePermission] = useState(false);
    const [deletePermission, setDeletePermission] = useState(false);
    const token = window.sessionStorage.getItem('accessToken'); 
    //**권한**//
    const navigate = useNavigate();
    const menuCd = "175"; 

    const [initDate, setInitDate] = useState(new Date()); //new Date()로 현재날짜 불러옴  
    const [initHakgi, setInitHakgi] = useState(""); //new Date()로 현재날짜 불러옴
    const [init_year, setInit_year] = useState(initDate.getFullYear()); ; //new Date()로 현재날짜 불러옴
    const [init_month, setInit_month] = useState(initDate.getMonth()); ; //new Date()로 현재날짜 불러옴
    const [clickBool, setClickBool] = useState(false); //new Date()로 현재날짜 불러옴

    const [scheduleList, setScheduleList] = useState([]); //0409   

    let calendar = []
    const [calendarList, setCalendarList] = useState();
    const [hakgiMonthList, setHakgiMonthList] = useState('');
    
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
        window.scroll(0,0)
    },[]);
    
    
    
    const Init = async () =>{
        try{
            let JsonArray = new Array();
            let JsonObject = new Object;
            let hakgiNum = hakgiFunc(init_month); //현재 달로 학기구하기
            JsonObject.YEAR = init_year; //현재년도
            JsonObject.HAKGI = hakgiNum; //현재학기
            setInitHakgi(hakgiNum);  //학기저장 
            JsonArray.push(JsonObject);  
            const res = await fetch(SERVER_URL+'/api/schedule/hakgi/list',{method:"POST", headers:{'content-type':'application/json'}, body : JSON.stringify(JsonArray)});
            const data = await res.json();       
            setScheduleList(data?.getScheduleList);
        }catch(e){
            console.log(e);
        }
    }     
    useEffect(() => {
        calenderList(initHakgi);
    },[initHakgi]);

    //현학기 ##############################################################################
    function hakgiFunc(init_month){ //현재학기
        if(init_month>=2 && init_month<=7){return 1}
        else{return 2}
    }

    
    //달력 ##############################################################################
    const groupDatesByWeek = (startDay, endDay) => {//달력만드는 함수
        const weeks = []; 
        let currentWeek = []; 
        let currentDate = new Date(startDay);       

        while (currentDate <= endDay) {
            const year = new Date(currentDate).getFullYear();
            const month = new Date(currentDate).getMonth();
            const date = new Date(currentDate).getDate();
            currentWeek.push([year,month,date])  
            if (currentWeek.length === 7 || currentDate.getDay() === 6) {                
                weeks.push(currentWeek);       
                currentWeek = [];       
            }
            currentDate.setDate(currentDate.getDate() + 1); 
        }        
        if (currentWeek.length > 0) {
          weeks.push(currentWeek); 
        }       
        return weeks; 
    };

    function calenderList(hakgiNum){ //이번학기 달력(6달) 리스트        
        let num =0;
        if(hakgiNum == 2){num = 6}        
        for(var i = 0; i < 6 ; i++){ 
            let month = i+num+2;
            let year = init_year; 
            if(month >= 12){month=month-12;year=year+1;} 
            const firstDayOfMonth = new Date(year, month, 1);//(년, 현재 달, 첫날)            
            const startDay = new Date(firstDayOfMonth);// 달력의 첫주 일요일(저번달의 마지막주 일요일)
            startDay.setDate(1 - firstDayOfMonth.getDay());
            const lastDayOfMonth = new Date(year, month + 1, 0);// 현재 달의 마지막 날            
            const endDay = new Date(lastDayOfMonth);// 달력의 마지막주 토요일(다음달 첫주 토요일)
            endDay.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));
            const date = groupDatesByWeek(startDay, endDay);
            calendar.push(date);                     
        }
        setCalendarList(calendar);
    }

    //다음,이전 버튼 ##############################################################################
    /*원래 */
    const prevHakgi = () => {  
        setClickBool(true);      
        if(initHakgi == 1){
           setInit_year(init_year-1) 
            setInitHakgi(2)
        }
        else if(initHakgi == 2){
             setInitHakgi(1)
         }
    };
    const nextHakgi = () => {
        setClickBool(true);      
        if(initHakgi == 1){            
            setInitHakgi(2)
        }
        else if(initHakgi == 2){
            setInit_year(init_year+1)
             setInitHakgi(1)
        }     
    };
    /*임시 
    const prevHakgi = () => {  
        setClickBool(true);    
        if(init_year > 2022 && initHakgi == 1){
            setInit_year(init_year-1) 
            setInitHakgi(2)
        }
        else if(init_year > 2021 && initHakgi == 2){
            setInitHakgi(1)
        }
    };
    const nextHakgi = () => {
        let current_y = new Date().getFullYear(); 
        let current_h = hakgiFunc(init_month); //현재 달로 학기구하기
        setClickBool(true);   
        if(initHakgi == 1){
            if(current_h == 1) { 
                if( init_year < current_y){setInitHakgi(2)}
            }
            else{setInitHakgi(2)}
        }
        else if(initHakgi == 2 && init_year != current_y){
            setInit_year(init_year+1)
            setInitHakgi(1)
        }
    };
    */
    
    const hakiApi = async () =>{      
        if(clickBool){
            try{     
                    
                let JsonArray = new Array();
                let JsonObject = new Object;
                JsonObject.YEAR = init_year;
                JsonObject.HAKGI = initHakgi;
                JsonArray.push(JsonObject);  
                const res = await fetch(SERVER_URL+'/api/schedule/hakgi/list',{method:"POST", headers:{'content-type':'application/json'}, body : JSON.stringify(JsonArray)});
                const data = await res.json();                              
                setScheduleList(data?.getScheduleList); 
                setClickBool(false)
            }catch(e){
                
            }
        }
    }
    useEffect(() => {
        hakiApi(); 
    },[clickBool]);

    //수정,삭제 ##############################################################################
    const scheduleCancle= async (id) => { 
        if(window.confirm("삭제된 게시글들은 복구할 수 없습니다.\n게시글을 삭제하시겠습니까?")){
            let JsonArray = new Array();
            let JsonObject = new Object;
            JsonObject.ID = id;
            JsonArray.push(JsonObject);
            const res = await fetch(SERVER_URL+'/api/schedule/delete',{method:"POST", headers:{'content-type':'application/json'}, body : JSON.stringify(JsonArray)});    
            const data = await res.json(); 
            if(data?.MSG == "SUCCESS"){
                Init(); 
            }
        }          
    }; 
    const modify = async (id) => {         
        navigate('/schedule/write?id='+id+"&y="+init_year+"&h="+initHakgi)   
    }; 

    //달력에 일정 체크 ##############################################################################
    const dayCHk = (month, day) => {
        for(var i=0; i<scheduleList.length; i++){
           if(month == Number(scheduleList[i].START_DATE.slice(4,6)) && day == Number(scheduleList[i].START_DATE.slice(6,8))){
             return true
           }
        }
        return false
    }

    return(
        <>
            <SubBannerComp menuCd={menuCd}/>
            <div className='subcontain'>
                <div className='infocontain'>
                    <div className='contents_area'>
                    
                    <div className='year_hak_area'>
                        <div className='btn prev' onClick={()=>prevHakgi()}></div>
                        <div className='year_hak'>{init_year}년 {initHakgi}학기 학사일정</div>
                        <div className='btn next' onClick={()=>nextHakgi()}></div> 
                        {initHakgi == 1 ? 
                        <ul className="monthlist">
                            <li><a href="#0">3월</a></li>
                            <li><a href="#1">4월</a></li>
                            <li><a href="#2">5월</a></li>
                            <li><a href="#3">6월</a></li>
                            <li><a href="#4">7월</a></li>
                            <li><a href="#5">8월</a></li>
                        </ul>  
                        :
                        <ul className="monthlist">
                            <li><a href="#0">9월</a></li>
                            <li><a href="#1">10월</a></li>
                            <li><a href="#2">11월</a></li>
                            <li><a href="#3">12월</a></li>
                            <li><a href="#4">1월</a></li>
                            <li><a href="#5">2월</a></li>
                        </ul>  
                        }
                    </div>
                    

                    {writePermission && <div className='viewBtn writeBtn'>                            
                        <Link to={URL.SCHEDULEMODI}><div className=''>학사일정등록</div></Link>        
                    </div>}

                    {calendarList?.map((data, index)=> {  
                        let isnothaksa = true ; 
                        return(
                            <div className='schedule_area' id={index}>
                                <div className='ob calendar_box'>
                                    <div className='cal_month'>                                                      
                                        <div><p>{calendarList[index][2][0][0]}</p> {calendarList[index][2][0][1] + 1}월</div>                            
                                    </div>                    
                                    <ul> 
                                        <li>일</li><li>월</li><li>화</li><li>수</li><li>목</li><li>금</li><li>토</li>
                                        {calendarList[index]?.map((data1, index1)=> {                                                                      
                                            return calendarList[index][index1]?.map((data2, index2)=> {
                                                let mark = dayCHk(calendarList[index][2][0][1]+1, data2[2])                                           
                                                return(                                                         
                                                    <li className={calendarList[index][2][0][1] != data2[1] ? "isnt":""}>                                                            
                                                        <div className={mark && "mark"}>{data2[2]}</div></li>
                                                    ) 
                                            })                 
                                        })}    
                                    </ul>
                                </div>

                                <div className='ob calendar_txt'>
                                    <div className='table_area calender'>                                        
                                        <table className='comm listTable'>
                                            <colgroup>
                                                <col width="25%"></col>
                                                <col width="auto"></col>                                
                                            </colgroup>
                                            <thead>
                                                <tr>
                                                    <th>날짜</th>
                                                    <th class="borR">학사일정 내용</th>
                                                    
                                                </tr>
                                            </thead>
                                            <tbody>
                                            
                                            
                                            {scheduleList?.map((data, scheduleindex)=> {
                                                
                                                if(Number(data.START_DATE.slice(4,6)) == calendarList[index][2][0][1] + 1){
                                                    isnothaksa=false;
                                                return(
                                                <tr>
                                                    <td>{data.START_DATE.slice(0,4)}.{data.START_DATE.slice(4,6)}.{data.START_DATE.slice(6,8)} 
                                                        {data.START_DATE != data.END_DATE && data.END_DATE != "" &&<p style={{display:'inline-block'}}> <span style={{marginLeft:'2px'}}>~</span> {data.END_DATE.slice(0,4)}.{data.END_DATE.slice(4,6)}.{data.END_DATE.slice(6,8)}</p>}
                                                    </td>
                                                    <td className="borR schedule_contents">
                                                        <div onClick={()=>modify(data.ID)}>{data.TITLE}</div>  
                                                        {writePermission &&  <div className='cancle' type="reset" onClick={()=>scheduleCancle(data.ID)}><img src="/images/file.png"/></div> }
                                                    </td>
                                                </tr>                                                        
                                                )}
                                             })} 
                                            {isnothaksa  ?
                                            <tr>
                                                <td colSpan={2} className='borR haksa_none'>등록된 학사일정이 없습니다.</td>
                                            </tr> 
                                             :null}
                                            </tbody>
                                        </table>
                                        
                                    </div>
                                </div>

                            </div>
                            
                        )
                    })}
                    
                </div>

                </div>

            </div>
        </>
        
    )
}

export default Schedule;