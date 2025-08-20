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
    // const [contentList, setContentList] = useState([]);
    
    // const [attachList, setAttachList] = useState( []);    
    const [file, setFile] = useState( []);  //사진    
    const [name, setName] = useState("");
    const [name_en, setName_en] = useState("");
    const [phone, setPhone] = useState("");
    const [mail, setMail] = useState("");
    const [gwamok, setGwamok] = useState("");  //과목
    const [room, setRoom] = useState(""); //연구실
    const [room_en, setRoom_en] = useState("");
    const [education, setEducation] = useState(""); //최종학력
    const [education_en, setEducation_en] = useState("");
    const [research, setResearch] = useState("");  //연구분야
    const [research_en, setResearch_en] = useState("");
    const [career, setCareer] = useState("");  //커리어
    const [career_en, setCareer_en] = useState("");
    const [seq, setSeq] = useState("");  //순서

    const navigate = useNavigate();
    //const token = window.sessionStorage.getItem('accessToken');
    useEffect(() => {
        if(query.id != undefined){
            Init();
        }       
        window.scrollTo(0, 0);
    },[menuCd]);

    const Init = async () =>{
        try{
            // let JsonArray = new Array();
            // let JsonObject = new Object;
            // JsonObject.BOARD_ID = BOARD_ID;
            // JsonObject.MENU_CD = MENU_CD;
            // JsonObject.FILE_ID = FILE_ID;
            // JsonObject.PATH = PATH;
            // JsonObject.FILE_NM = FILE_NM;
            // JsonArray.push(JsonObject);

            const res = await fetch(SERVER_URL+"/api/profile/"+menuCd+"/"+query.id+"/view",{method:"POST", headers:{'content-type':'application/json'}});
            const data = await res.json();  
            // setContentList(data.getProfileList);
            setContents(data.getProfileView)
            // setAttachList(data.getAttachList);            
            if(data.getAttachList[0] != null || data.getAttachList[0] != undefined){
                setFile(data.getAttachList);
            }            
        }catch(e){
            console.log(e);
        }
    }
    useEffect(() => {
        attachHTMLRender();
    },[file]);    
          

    function setContents(list){        
        setCareer(list.CAREER);
        setCareer_en(list.CAREER_EN);
        setName(list.NAME);
        setName_en(list.NAME_EN);
        setPhone(list.PHONE);
        setMail(list.MAIL);
        setGwamok(list.GWAMOK);
        setRoom(list.ROOM);
        setRoom_en(list.ROOM_EN);
        setEducation(list.EDUCATION);
        setEducation_en(list.EDUCATION_EN);
        setResearch(list.RESEARCH);
        setResearch_en(list.RESEARCH_EN);                
        setSeq(list.SEQ);            
    }

    useEffect(() => {
        attachHTMLRender();
    },[file]);

    const handleSave = async () => {
        if(name == ''){
            alert("이름을 입력해주세요.");
            return;
        }
        if(phone == '' ){
            alert("전화를 입력해주세요.");
            return;
        }
        
        
        if(education == ''){
            alert("학위를 입력해주세요.");
            return;
        }
        if(research == ''){
            alert("연구분야 입력해주세요.");
            return;
        }
        
        
        const formData = new FormData();
        const inputAttach = document.querySelectorAll("[type=file]");
        inputAttach.forEach((file, index)=>{        
            if(file.files.length > 0){
                formData.append('file'+(index+1), file.files[0]);
            }
        });
        if(query.id !== undefined){
            formData.append('ID', query.id);
        }
        formData.append('MENU_CD', menuCd);
        formData.append('GUBUN', '0');
        formData.append('NAME', name);
        formData.append('NAME_EN', name_en =="" ? name : name_en);

        formData.append('PHONE', phone);
        formData.append('MAIL', mail);
        formData.append('GWAMOK', gwamok);

        formData.append('ROOM', room);
        formData.append('ROOM_EN', room_en =="" ? room : room_en);
        formData.append('EDUCATION', education);
        formData.append('EDUCATION_EN', education_en == "" ?education: education_en);
        formData.append('RESEARCH', research);
        formData.append('RESEARCH_EN', research_en =="" ? research:research_en);
        formData.append('CAREER', career);
        formData.append('CAREER_EN', career_en =="" ? career : career_en);
        formData.append('SEQ', seq);
        formData.append('ACTIVITY', "1");
        formData.append('USER_ID', "test");

      
       
        const res = await fetch(SERVER_URL+'/api/profile/'+menuCd+'/write', {method: "POST",
            headers: {
              //'Content-Type': 'multipa rt/form-data',
            },
            body : formData
        });
        const data = await res.json(); 
        data?.MSG == "SUCCESS" ? navigate('/profile/'+menuCd+'/list'): console.log('업로드실패');
    }

    const handleFileChange = (index) => (event) => {        
        const selectedFile = event.target.files[0]; // 선택된 파일 객체        
        if (selectedFile) {
            const newFileArray = [...file]; // 기존 파일 배열 복사            
            if(newFileArray[index]?.constructor !== File && newFileArray[index] !== undefined){
                handleFileDelete(newFileArray[index].BOARD_ID, newFileArray[index].MENU_CD, newFileArray[index].FILE_ID, newFileArray[index].PATH, newFileArray[index].FILE_NM
                );
            }
            newFileArray[index] = selectedFile; // 선택된 파일로 해당 인덱스 업데이트
            setFile(newFileArray); // 상태 업데이트
        }
    };
    const handleFileDelete = async (BOARD_ID, MENU_CD, FILE_ID, PATH, FILE_NM) => {
        let JsonArray = new Array();
        let JsonObject = new Object;
        JsonObject.BOARD_ID = BOARD_ID;
        JsonObject.MENU_CD = MENU_CD;
        JsonObject.FILE_ID = FILE_ID;
        JsonObject.PATH = PATH;
        JsonObject.FILE_NM = FILE_NM;
        JsonArray.push(JsonObject);       

        const res = await fetch(SERVER_URL+'/api/attach/delete',{method: "POST", headers : {"Content-Type" : "application/json;charset=utf-8;" }, body : JSON.stringify(JsonArray)});     
    }
    const handleFileCancle = (index) => {        
        const inputFile = document.getElementById('file' + index);
        const dataTransfer = new DataTransfer();
        const newFileArray = [...file]; // 기존 파일 배열 복사            
        if(newFileArray[index]?.constructor !== File && newFileArray[index] !== undefined){
            handleFileDelete(newFileArray[index].BOARD_ID, newFileArray[index].MENU_CD, newFileArray[index].FILE_ID, newFileArray[index].PATH, newFileArray[index].FILE_NM)
        }   
        newFileArray[index] = undefined; // 선택된 파일로 해당 인덱스 업데이트     
        setFile(newFileArray);   
        inputFile.files = dataTransfer.files;                
    };

    const attachHTMLRender = () => {
        let attachList = [];
        for(let i = 0; i < 1; i ++){
            attachList.push(
                <div className='insert_file' key={i}>                                                       
                    <input className="upload-name" name="files"  defaultValue={file[i]?.name || file[i]?.ORI_FILE_NM} placeholder="파일첨부" readOnly/>                    
                    <label htmlFor={'file'+(i)}>파일선택</label>  
                    <input type="file" id={'file'+(i)} onChange={handleFileChange(i)}/> 
                    {file[i] ? <div className='cancle' type="reset" onClick={()=>handleFileCancle(i)}><img src="/images/file.png"/></div> :null}
                </div>                
            );
        }
        return attachList;
    }
        

    return(
        <>
            <SubBannerComp menuCd={menuCd}/>
            <div className='subcontain'>
                {/* <SideMenuComp menuCd={menuCd}/>                 */}
                <div className='infocontain'>
                    {/* <PathbarComp menuCd={menuCd}/> */}
                    <div className='contents_area'>
                        <div className='contentBox'>                           

                            <div class="li_title">
                            <p class="title mgB_12">교수진 등록</p>
                            </div>
                            <div className='table_area contentsModi'>
                                <table className='comm writeTable'>
                                    <colgroup>
                                        <col width="12%"></col>
                                        <col width="38%"></col> 
                                        <col width="12%"></col>
                                        <col width="35%"></col> 
                                    </colgroup>
                                    
                                    <tbody>
                                        <tr className='top'>
                                            <td className='title'>이름</td>  
                                            <td className='txt'><input 
                                                className='titleInput' 
                                                type="text"  
                                                required
                                                value={name} 
                                                onChange={(e)=>{setName(e.target.value);}} //저장
                                                />
                                            </td>
                                            <td className='title'>이름<p>[영문]</p></td>  
                                            <td className='txt borR'><input 
                                                className='titleInput' 
                                                type="text"  
                                                required
                                                value={name_en} 
                                                onChange={(e)=>{setName_en(e.target.value);}} //저장
                                                />
                                            </td>                                                                   
                                        </tr>                                         
                                        <tr>
                                            <td className='title'>전화</td>  
                                            <td className='txt'><input 
                                                className='titleInput' 
                                                type="text"  
                                                required
                                                value={phone} 
                                                onChange={(e)=>{setPhone(e.target.value);}} //저장
                                                /></td>   
                                                <td className='title'>이메일</td>  
                                            <td className='txt borR'><input 
                                                className='titleInput' 
                                                type="text"  
                                                required
                                                value={mail} 
                                                onChange={(e)=>{setMail(e.target.value);}} //저장
                                                /></td>                                                             
                                        </tr>
                                        <tr>
                                            <td className='title'>과목</td>  
                                            <td className='txt borR' colSpan={3}><input 
                                                className='titleInput' 
                                                type="text"  
                                                required
                                                value={gwamok} 
                                                onChange={(e)=>{setGwamok(e.target.value);}} //저장
                                                />
                                            </td>                                                                                                            
                                        </tr>
                                        <tr>
                                            <td className='title'>순서</td>  
                                            <td className='txt borR' colSpan={3}><input 
                                                className='titleInput' 
                                                type="text"  
                                                required
                                                value={seq} 
                                                onChange={(e)=>{setSeq(e.target.value);}} //저장
                                                />
                                            </td>                                                                
                                        </tr>  
                                        <tr className='down'>
                                            <td className='title'>사진</td>  
                                            <td className='borR' colSpan={3}>{attachHTMLRender()}</td>                                                                
                                        </tr> 
                                        <tr>
                                            <td className='title'>연구실</td>  
                                            <td className='txt'><input 
                                                className='titleInput' 
                                                type="text"  
                                                required
                                                value={room} 
                                                onChange={(e)=>{setRoom(e.target.value);}} //저장
                                                />
                                            </td> 
                                            <td className='title'>연구실<p>[영문]</p></td>  
                                            <td className='txt borR'><input 
                                                className='titleInput' 
                                                type="text"  
                                                required
                                                value={room_en} 
                                                onChange={(e)=>{setRoom_en(e.target.value);}} //저장
                                                />
                                            </td>                                                                  
                                        </tr> 
                                        <tr>
                                            <td className='title'>학위</td>  
                                            <td className='txt'><input 
                                                className='titleInput' 
                                                type="text"  
                                                required
                                                value={education} 
                                                onChange={(e)=>{setEducation(e.target.value);}} //저장
                                                />
                                            </td> 
                                            <td className='title'>학위<p>[영문]</p></td>  
                                            <td className='txt borR'><input 
                                                className='titleInput' 
                                                type="text"  
                                                required
                                                value={education_en} 
                                                onChange={(e)=>{setEducation_en(e.target.value);}} //저장
                                                />
                                            </td>                                                                  
                                        </tr>
                                        <tr>
                                            <td className='title'>연구분야</td>  
                                            <td className='txt'><input 
                                                className='titleInput' 
                                                type="text"  
                                                required
                                                value={research} 
                                                onChange={(e)=>{setResearch(e.target.value);}} //저장
                                                />
                                            </td> 
                                            <td className='title'>연구분야<p>[영문]</p></td>  
                                            <td className='txt borR'><input 
                                                className='titleInput' 
                                                type="text"  
                                                required
                                                value={research_en} 
                                                onChange={(e)=>{setResearch_en(e.target.value);}} //저장
                                                />
                                            </td>                                                                  
                                        </tr>
                                        <tr>
                                            <td className='title'>주요경력</td>  
                                            <td className='txt'><textarea
                                                className='titleInput' 
                                                type="text"  
                                                required
                                                value={career} 
                                                onChange={(e)=>{setCareer(e.target.value);}} //저장
                                                />
                                            </td> 
                                            <td className='title'>주요경력<p>[영문]</p></td>  
                                            <td className='txt borR'><textarea
                                                className='titleInput' 
                                                type="text"  
                                                required
                                                value={career_en} 
                                                onChange={(e)=>{setCareer_en(e.target.value);}} //저장
                                                />
                                            </td>                                                                  
                                        </tr> 
                                                   
                                        
                                    </tbody>                    
                                </table>
        
                                <div className='viewBtn viewMarB writeBtn'>
                                    <Link to={"/profile/"+menuCd+"/list"}><div className='prev'>취소</div></Link>
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