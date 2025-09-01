const URL = {
  //:menuCd 변수
    MAIN: "/", 
    // CONTENTS: "/contents/:menuCd/view",  
    // LIST: "/board/:menuCd/list", 
    // GRID: "/board/178/list",  
    // VIEW: "/board/:menuCd/view",
    // WRITE: "/board/:menuCd/write",   
    // SCHEDULE: "/schedule/list",    
    // SCHEDULEMODI: "/schedule/write",
    // PROF: "/profile/:menuCd/list",
    // PROFMODI: "/profile/:menuCd/write",
    // SUBJECT: "/subject/:menuCd/list",
    // SUBJECTMODI: "/subject/:menuCd/write",

    // - /:menuCd/notice, /guideline,  /library, /talk, /video, /result
    CONTENTS: "/:menuCd/guideline",  
    LIST1: "/:menuCd/talk", 
    LIST2: "/:menuCd/library",
    LIST3: "/:menuCd/notice", 
    LIST4: "/:menuCd/result", 

    GRID: "/:menuCd/video",  
    VIEW: "/board/:menuCd/view",
    WRITE: "/board/:menuCd/write",
    

    LOGIN: "/login",
    ADMIN: "https://cms.cs.ac.kr",
    // ADMIN: "http://100.100.91.41:3001",
  };
  
  export default URL;