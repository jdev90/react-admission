//import logo from './logo.svg';
import './App.css';
import './assets/css/base.css';
import './assets/css/pages.css';
import './assets/css/common.css';
import { BrowserRouter, Route, Routes, Navigate, useLocation} from "react-router-dom";
import React, { useEffect, useState, Suspense, lazy  } from 'react';
import URL from './context/url';
import qs from 'qs';
//import axios from 'axios'


import Top from "./pages/common/Top";
import STTop from "./pages/common/ScrollToTop";
import QuickMenu from "./pages/common/QuickMenu";

import Main from "./pages/main/Main";
import Contents from "./pages/sub/content/Contents";
import List from "./pages/sub/board/List";
import Grid from "./pages/sub/board/Grid";
import View from "./pages/sub/board/View";
import Write from "./pages/sub/board/Write";
import Schedule from "./pages/sub/schedule/Schedule";
import ScheduleModi from "./pages/sub/schedule/ScheduleModi";
import Prof from "./pages/sub/profile/Profile";
import ProfModi from "./pages/sub/profile/ProfileModi";
import Subject from "./pages/sub/subject/Subject";
import SubjectModi from "./pages/sub/subject/SubjectModi";


import Login from "./pages/sub/Login";
import Error from "./pages/common/Error";

import Footer from "./pages/common/Footer";
import { isTokenValid, getUserRoles } from './assets/js/jwt';
import SubBannerComp from 'pages/common/components/subBannerComp';
function App() {


  //권한이 필요한 라우터에 토큰 체크
  const ProtectedRoute = ({ element, requiredRoles, ...rest }) => {
    const location = useLocation();
    //const query = qs.parse(location.search, {ignoreQueryPrefix: true});	
    const [isValid, setIsValid] = useState(null);
    const [hasRequiredRole, setHasRequiredRole] = useState(null);

    useEffect(() => {
      
      const checkToken = async () => {
        const token = window.sessionStorage.getItem("accessToken");
        if (token == null) {
          setIsValid(false);
          return;
        }

        const valid = await isTokenValid(token);
        if (!valid) {
          setIsValid(false);
          return;
        }

        const roles = getUserRoles(token);
        const hasRole = requiredRoles.some(role => roles.includes(role));
        setIsValid(true);
        setHasRequiredRole(hasRole);
      };

      checkToken();
    }, [requiredRoles]);

    if (isValid === null) {
      return <div><SubBannerComp/><div className='subcontain'><div style={{lineHeight:"400px", fontSize:"26px", fontWeight:"500"}}>Loading...</div></div></div>; // 로딩 중일 때 표시할 컴포넌트
    }

    if (!isValid) {
      return <Navigate to={URL.LOGIN+'?url='+`${location.pathname}${location.search}`}/>;
    }

    return hasRequiredRole ? element : <Navigate to={URL.ERROR} />;
  };

  //useEffect(() => {
  //  async function fetchdata() {
  //    const { data } = await axios.get('/users');
  //    console.log(data);
  //  }
  //  fetchdata();
  //}, []);
  //useEffect(()=>{      
  //  axios.get('http://localhost:5000') //정상작동
  //  .then(function (response) { console.log(response); })
  //  .catch(function (error) { console.log(error); })
  //},[])

  return (
    <div className="App">
      <title>창신대학교 대학원</title>
      <BrowserRouter>
        <Top />        
          <div id='CONTAINER'>   
            <Routes>
              <Route path={URL.MAIN} element={<Main/>} />
              <Route path={URL.CONTENTS} element={<Contents/>} /> 
              <Route path={URL.LIST} element={<List/>} />
              <Route path={URL.GRID} element={<Grid/>} />
              <Route path={URL.VIEW} element={<View/>} /> 
              {/* <Route path={URL.WRITE} element={<ProtectedRoute element={<Write />} requiredRoles={['ADMIN', 'MANAGER']} />} />  */}
              <Route path={URL.WRITE} element={<Write/>} /> 
              <Route path={URL.SCHEDULE} element={<Schedule/>} />
              <Route path={URL.SCHEDULEMODI} element={<ProtectedRoute element={<ScheduleModi/>} requiredRoles={['ADMIN', 'MANAGER']} />} />
              <Route path={URL.PROF} element={<Prof/>} />
              <Route path={URL.PROFMODI} element={<ProtectedRoute element={<ProfModi/>} requiredRoles={['ADMIN', 'MANAGER']} />} />
              <Route path={URL.SUBJECT} element={<Subject/>} />
              <Route path={URL.SUBJECTMODI} element={<ProtectedRoute element={<SubjectModi/>} requiredRoles={['ADMIN', 'MANAGER']} />} />
              <Route path={URL.LOGIN} element={<Login/>} />
              <Route path="/*" element={<Error/>} />
            </Routes>
            <QuickMenu/>
            <STTop/>
            <Footer/>
          </div>
        
      </BrowserRouter>
    </div>
  );
}

export default App;
