const URL = {
    MAIN: "/", //메인페이지
    //:menuCd 변수
    // CONTENTS: "/contents/:menuCd", 
    CONTENTS: "/contents/:menuCd/view", //수정 
    // LIST: "/board/:menuCd",
    LIST: "/board/:menuCd/list",//수정 
    // GRID: "/board/178", //갤러리
    GRID: "/board/178/list", //수정 
    VIEW: "/board/:menuCd/view",
    // WRITE: "/write/:menuCd", 
    WRITE: "/board/:menuCd/write", //수정  

    SCHEDULE: "/schedule/list",    
    SCHEDULEMODI: "/schedule/write",
    PROF: "/profile/:menuCd/list",
    PROFMODI: "/profile/:menuCd/write",
    SUBJECT: "/subject/:menuCd/list",
    SUBJECTMODI: "/subject/:menuCd/write",


    LOGIN: "/login",
    ADMIN: "https://cms.cs.ac.kr",
    // ADMIN: "http://100.100.91.41:3001",
    
  };
  
  export default URL;