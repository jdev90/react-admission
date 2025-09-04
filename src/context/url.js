const URL = {
  //:menuCd 변수
    MAIN: "/", 
    // - /:menuCd/notice, /guideline,  /library, /talk, /video, /result, /early/receipt /assistant/brochure
    CONTENTS: "/:menuCd/guideline",  //모집요강(pdf)
    CONTENTS2: "/:menuCd/result",  // 입시결과(pdf)
    CONTENTS3: "/:menuCd/receipt", //원서접수
    CONTENTS4: "/:menuCd/brochure", //안내책자(pdf)

    LIST1: "/:menuCd/talk", 
    LIST2: "/:menuCd/library",
    LIST3: "/:menuCd/notice", 
    GRID: "/:menuCd/video",  
    VIEW: "/board/:menuCd/view",
    WRITE: "/board/:menuCd/write",
    
    SITEMAP: "/sitemap",
    LOGIN: "/login",
    ADMIN: "https://cms.cs.ac.kr",
    // ADMIN: "http://100.100.91.41:3001",
  };
  
  export default URL;