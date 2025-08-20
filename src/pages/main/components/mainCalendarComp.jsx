
import React, { useState, useEffect } from 'react';
import {  Link } from 'react-router-dom';
import {SERVER_URL} from 'context/config'; //
import URL from 'context/url';

const MainCalendarComp = (props) => {   
    
    const [scheduleList, setScheduleList] = useState([]); //달별로 분리된 학사일정 리스트
    let isnotList = true;

    //달력
    const [calendar, setCalendar] = useState(); 
    const [currentDate, setCurrentDate] = useState(new Date()); //new Date()로 현재날짜 불러옴
    const year = currentDate.getFullYear(); 
    const month = currentDate.getMonth();  
    const firstDayOfMonth = new Date(year, month, 1);//(년, 현재 달, 첫날)
    const startDay = new Date(firstDayOfMonth);
    startDay.setDate(1 - firstDayOfMonth.getDay());
    const lastDayOfMonth = new Date(year, month + 1, 0);// 현재 달의 마지막 날    
    const endDay = new Date(lastDayOfMonth);
    endDay.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));

    
    useEffect(() => {
        Init();        
    },[year,month]);

   

    const Init = async () =>{
        try{
            const calData = groupDatesByWeek(startDay, endDay);
            setCalendar(calData); 

            let JsonArray = new Array();
            let JsonObject = new Object;
            let hakgiNum = hakgiFunc(month); //몇월달인지 확인하고 학기 알려주는 함수
            JsonObject.YEAR = year; //현재 년도
            JsonObject.HAKGI = hakgiNum; //학기
            
            JsonArray.push(JsonObject);  
            const res = await fetch(SERVER_URL+'/api/schedule/hakgi/list',{method:"POST", headers:{'content-type':'application/json'}, body : JSON.stringify(JsonArray)});
            const data = await res.json(); 
            setScheduleList(data.getScheduleList);
            
        }catch(e){
            console.log(e);
        }
    }
   


    
    function hakgiFunc(month){ //학기 알려주는 함수
        if(month>=2 && month<=7){return 1}
        else{return 2}
    }

    

    const groupDatesByWeek = (startDay, endDay) => {
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
    /*원래*/
    const prevMonth = () => {setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));};
    const nextMonth = () => {setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));};
    /*임시
    const prevMonth = () => {
        if (2022 <= new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1).getFullYear()){ //일단 2022년도 이후로 안내려가게
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        }
    };        
    const nextMonth = () => {
       let current_h = hakgiFunc(new Date().getMonth()) //일단 현학기 위로 안넘어가도록
       let current_y = new Date().getFullYear();
       let next_y = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1).getFullYear()
       let next_m = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1).getMonth()
       
       if(current_h == 1){
            if(next_y == current_y && next_m <= 7){  setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));  }
            else if(next_y != current_y ){setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); }
       }
       else{
            if(next_y == current_y+1 && next_m < 2){  setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); }
            else if(next_y < current_y+1){ setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); }
       }
    };*/

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
            <div className='Main mainSchedule'>
                <div className='MainTitle'>
                    <div className='ob'>
                        <h1 >학사일정</h1>
                        <div className='Maintxt'>                            
                            <p>창신대학교 대학원의 학사일정입니다.</p>                            
                        </div>
                    </div>
                    
                    <div className='ob right'><Link to={"/schedule/list"} className='tab more'><img  src='/images/more.png' alt='공지사항 더보기'/></Link></div>
                </div>
                <div className='calendar_area'>
                    <div className='ob calendar_box'>
                        <div className='cal_month'>
                            <div className='btn prevM' onClick={()=>prevMonth()}></div>
                            <div><p>{year}</p>{month+1}월</div>
                            <div className='btn nextM' onClick={()=>nextMonth()}></div>
                        </div>                        
                        <ul> 
                            <li>일</li><li>월</li><li>화</li><li>수</li><li>목</li><li>금</li><li>토</li>
                            {calendar?.map((data1, index1)=> {                        
                                return calendar[index1]?.map((data2, index2)=> { 
                                    let mark = dayCHk(month+1, data2[2])                                           
                                    return( 
                                        <li className={data2[1] != month && "isnt"}><div className={mark && 'mark'}>{data2[2]}</div></li>
                                        ) 
                                })                 
                            })}    
                        </ul>
                    </div>
                    <div className='ob calendar_txt'>
                        <ul>
                        {scheduleList?.map((data1, index)=> {                            
                            if(month+1 == Number(data1.START_DATE.slice(4,6))){
                                isnotList = false;
                                return(
                                <li>
                                    <span>{data1.START_DATE.slice(0,4)}.{data1.START_DATE.slice(4,6)}.{data1.START_DATE.slice(6,8)}</span> 
                                    {data1.TITLE}
                                </li>
                               
                                )
                            }
                            
                        })} 
                        {isnotList && <li className='none'>등록된 학사일정이 없습니다.</li>}
                        </ul>
                    </div>
                </div>
            </div> 
                  

           
        </>
        
    )
}

export default MainCalendarComp;