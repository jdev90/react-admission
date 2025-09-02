const URL = {
  //:menuCd 변수
    MAIN: "/", 
    // - /:menuCd/notice, /guideline,  /library, /talk, /video, /result
    CONTENTS: "/:menuCd/guideline",  
    CONTENTS2: "/:menuCd/result", 
    LIST1: "/:menuCd/talk", 
    LIST2: "/:menuCd/library",
    LIST3: "/:menuCd/notice", 
    //LIST4: "/:menuCd/result", 
    GRID: "/:menuCd/video",  
    VIEW: "/board/:menuCd/view",
    WRITE: "/board/:menuCd/write",
    
    SITEMAP: "/sitemap",
    LOGIN: "/login",
    ADMIN: "https://cms.cs.ac.kr",
    // ADMIN: "http://100.100.91.41:3001",
  };
  
  export default URL;