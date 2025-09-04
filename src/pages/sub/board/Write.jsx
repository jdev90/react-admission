import React, { useState, useEffect ,useRef, useMemo} from 'react';
import { useParams , Link, useLocation, useNavigate} from 'react-router-dom';
import { SERVER_URL } from 'context/config'; //
import ReCAPTCHA from "react-google-recaptcha";
import qs from 'qs';
import SubBannerComp from 'pages/common/components/subBannerComp';
import ContentMenuComp from 'pages/common/components/contentMenuComp';

// import { getTokenData,getUserRoles } from 'server';
// import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { ClassicEditor } from 'ckeditor5';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { editorConfig }from 'assets/js/ckeditor5_config.js'
import 'ckeditor5/ckeditor5.css';
import { getTokenData,getUserRoles } from 'assets/js/jwt';
import {getMenuInfoMenuCd, getMenuInfo} from "assets/js/utils";

const token = window.sessionStorage.getItem('accessToken');
let roles;
if(token) {roles = getUserRoles(token);}

const Write = (props) => { 
    const location = useLocation();  
    const navigate = useNavigate(); 
    const query = qs.parse(location.search, {ignoreQueryPrefix: true});
    const params = useParams();
	const allmenuCd = params.menuCd;
    const [cateList, setCateList] = useState([]);
    const [cate, setCate] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    //const [save, setSave] = useState(false);
    const [file, setFile] = useState( []);
    const [attachList, setAttachList] = useState( []);
    const [notice, setNotice] = useState(0);
    const [passwd, setPasswd] = useState('');
    const [privacy, setPrivacy] = useState(0);
    const boardId = query.boardId;
    const token = sessionStorage.getItem('accessToken');
    let userData;
    const recaptchaRef = React.createRef();    
    
    if(token) {userData = getTokenData(token);}
    let menuInfo;let menuCd;
    if(query.url !== undefined ){
        menuInfo = getMenuInfo(query.url);
        menuCd = menuInfo?.MENU_CD;
    }else{
        menuCd = query.menuId;
        menuInfo = getMenuInfoMenuCd(menuCd);
    }
    
    
    useEffect(() => {
        // if(!token && menuInfo.USER_WRITE != 1 ){
        //    navigate("/login?url="+location.pathname)
        // }
        if(query.boardId !== undefined){
            Init();
            window.scrollTo(0, 0);
        }
        getCate();
    },[menuCd]);

    useEffect(() => {
        attachHTMLRender();
    },[file]);
    useEffect(() => {
        if(attachList[0] != null){//파일있으면 가져옴 
            setFile(attachList);
        }
    },[attachList]);

    const getCate = async () =>{
        let JsonArray = new Array();
        let JsonObject = new Object;
        JsonObject.CODE = 'CATE';
        JsonArray.push(JsonObject);
        const res = await fetch(SERVER_URL+'/api/code/list',{method: "POST", headers : {"Content-Type" : "application/json;charset=utf-8;" }, body : JSON.stringify(JsonArray)});
        const data = await res.json();

        setCateList(data.getCodeList);
        console.log(data.getCodeList);
    }
    const Init = async () =>{
        try{                   
            const res = await fetch(SERVER_URL+'/api/board/'+allmenuCd +'/'+boardId +'/view',{method: "POST", headers : {"Content-Type" : "application/json;charset=utf-8;" }});
            const data = await res.json();
            
            setContent(data.getBoardView[0]?.CONTENT);
            setTitle(data.getBoardView[0]?.TITLE); //제목 가져옴 
            setNotice(data.getBoardView[0]?.NOTICE)  
            setPasswd(data.getBoardView[0]?.PASSWD)  
            setCate(data.getBoardView[0]?.CATE) ;
            setPrivacy(data.getBoardView[0]?.PRIVACY)
            setAttachList(data.getAttachList);            

        }catch(e){
            console.log(e);
        }
    }
   
    const config = useMemo(() => ({ ...editorConfig, menuCd }), [menuCd]);
    

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
        for(let i = 0; i < 5; i ++){
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
    

    const handleSave = async () => {
        //공통 이거는 그대로
        if(title == undefined || title == '' ){
             alert("제목을 입력해주세요.");
            return;
        }
        if(content == undefined || content == ''){
            alert("내용을 입력해주세요.");
            return;
        }
        if(menuInfo?.USER_WRITE == 1 && passwd == ''){
            alert("비밀번호를 입력해주세요.");
            return;
        }

        const formData = new FormData();
        const inputAttach = document.querySelectorAll("[type=file]");
        inputAttach.forEach((file, index)=>{        
            if(file.files.length > 0){
                formData.append('file'+(index+1), file.files[0]);
            }
        });
        
        formData.append('BOARD_ID', query.boardId !== undefined ? query.boardId : "");
        formData.append('MENU_CD', allmenuCd);
        formData.append('TITLE', title);
        formData.append('CONTENT', content);
        formData.append('USER_ID', token ? userData.user.id :"user");//userData.user.id
        formData.append('NOTICE', notice);
        formData.append('PASSWD', passwd);
        formData.append('PRIVACY', privacy);
        formData.append('CATE', cate);
        
       
        const res = await fetch(SERVER_URL+'/api/board/'+allmenuCd+'/write', {method: "POST",
            headers: {
            },
            body : formData
        });
        const data = await res.json(); 
        data?.MSG == "SUCCESS" ? query.url != undefined ? navigate(query.url):navigate(getMenuInfoMenuCd(query.menuId).LINK) : console.log('업로드실패');
    }
    
useEffect(() => {
        console.log(cate);
    },[cate]);

    const customUploadAdapter = (loader) => { // (2)
        return {
            upload(){
                return new Promise ((resolve, reject) => {
                    const data = new FormData();
                    loader.file.then( (file) => {
                            data.append("name", file.name);
                            data.append("file", file);
                        })
                })
            }
        }
    }
    function uploadPlugin (editor){ // (3)
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return customUploadAdapter(loader);
        }
    }
     
    if (!Array.isArray(cateList)) {
        return <div style={{height:"1000px"}}></div>
    } 

    // const handleMessage = ({ privacy, reply, user_write }) => {
    //    setPrivacyA(privacy)
    //    setUser_writeA(user_write)

    // };

    
    return(
        <>
            {/* <SubBannerComp menuCd={menuCd} onMessage={handleMessage}/> */}
            <SubBannerComp menuCd={menuCd} />
                <div className='Subcontain'>
                <ContentMenuComp menuCd={menuCd}/>                          
                    <div className='contentBox'>
                    <div className='table_area'>
                        <table className='comm writeTable'>
                            <colgroup>
                                <col width="50px"></col>
                                <col width="35%"></col>
                                <col width="15%"></col>
                                <col width="35%"></col>  
                            </colgroup>
                            <thead>
                                <tr>                               
                                    <th className='borR' colSpan={2}>{ boardId !== undefined ? '게시글 수정' : '게시글 작성'}</th>                                
                                </tr>                                                        
                            </thead>
                            <tbody>
                                <tr className='title'>
                                    <td>제목</td>  
                                    <td className='txt borR' colSpan={3}>
                                        <input 
                                            className='titleInput' 
                                            type="text"  
                                            required
                                            value={title} 
                                            onChange={(e)=>{setTitle(e.target.value);}} //저장
                                            placeholder='제목을 입력하세요.'/>
                                    </td>                                                                 
                                </tr>
                                {( query.menuId != 572) &&  <tr>
                                    <td>카테고리</td>  
                                    <td className='txt borR' colSpan={3}>
                                        <select id="gubun" className='cate_op'  value={cate} onChange={(e)=>{setCate(e.target.value);}}>
                                            <option value="">선택</option>
                                             {/* {cateList.length == 0 && cateList?.map((data, index)=> {
                                                return(
                                                    <option value={data.KEY} onChange={(e)=>{setCate(e.target.value);}} key={index}>{data.VALUE}</option>
                                                )
                                             })}   */}
                                             <option value={0} onChange={(e)=>{setCate(e.target.value);}}>공통</option>
                                             <option value={1} onChange={(e)=>{setCate(e.target.value);}}>수시</option>
                                             <option value={2} onChange={(e)=>{setCate(e.target.value);}}>정시</option>
                                             <option value={3} onChange={(e)=>{setCate(e.target.value);}}>편입학</option>
                                             <option value={4} onChange={(e)=>{setCate(e.target.value);}}>외국인</option>
                                             
                                             

                                        </select>
                                    </td>                                                                 
                                </tr>}
                                
                               
                                <tr className='noti_option'>
                                    <td>옵션</td>  
                                    <td className={menuInfo?.USER_WRITE == 1 ? 'checkbox' : 'checkbox borR'} colSpan={menuInfo?.USER_WRITE == 1 ? 0 : 3}>
                                        {menuInfo?.PRIVACY == 1 && <><input type="checkbox" name="noti" value={privacy == 0 ? 1 : 0} checked={privacy == 1}  onClick={(e)=>{setPrivacy(e.target.value);}}/><span>비밀글</span></>}
                                        {menuInfo?.USER_WRITE != 1 && <> <input type="checkbox" name="noti" value={notice == 0 ? 1 : 0} checked={notice == 1}  onClick={(e)=>{setNotice(e.target.value);}}/><span>공지</span></> }
                                    </td> 
                                    {menuInfo?.USER_WRITE == 1 && 
                                    <><td>비밀번호</td>  
                                    <td className='txt borR'>
                                        <input 
                                            className='secret_key' 
                                            required
                                            // value={passwd} 
                                            type="password"
                                            onChange={(e)=>{setPasswd(e.target.value);}} //저장
                                        />
                                    </td> </>
                                    }    
                                </tr> 
                                <tr className='content'>
                                    <td>내용</td>                                
                                    <td className='txt borR' colSpan={3}>
                                        <CKEditor editor={ClassicEditor} 
                                            config={config}                                         
                                            data={content ?? ''}
                                            onChange={ ( event, editor ) => setContent(editor.data.get()) } //저장
                                            placeholder='내용을 입력하세요.'
                                        />          
                                    </td>                                                                                                     
                                </tr>
                                
                                {/*                                 
                                <tr>
                                    <td>보안키</td>  
                                    <td className='chapcha borR' colSpan={3}>
                                        <form>
                                            <ReCAPTCHA
                                                ref={recaptchaRef}
                                                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                                            />
                                        </form>
                                    </td>
                                </tr> */}
                                
                                                
                                <tr className='down'>
                                    <td>파일첨부</td>  
                                    <td className='borR'colSpan={3} >{attachHTMLRender()}</td>                                                                
                                </tr>
                            </tbody>                    
                        </table>

                        <div className='viewBtn viewMarB writeBtn'>
                            <Link to={query.url}><div className='prev'>취소</div></Link>
                            <div className='next' onClick={()=> handleSave()}>저장</div>                       
                        </div>

                        {/* <form onSubmit={() => { recaptchaRef.current.execute(); }}>
                            <ReCAPTCHA
                                ref={recaptchaRef}                                
                                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                            // onChange={onChange}
                            />
                        </form> */}
                        
                        
                    </div>
                </div>
            </div>
        </>
        
    )
}

export default Write;