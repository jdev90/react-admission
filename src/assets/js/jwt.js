import { Navigate } from 'react-router-dom';

export function getTokenData(jwtToken){

    const payload = jwtToken.split('.')[1]; // 페이로드 추출
    const decodedPayload = JSON.parse(base64UrlDecode(payload));

    return decodedPayload;

}

function base64UrlDecode(str) {
    // Base64Url에서 Base64로 변환
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // 길이를 4의 배수로 맞추기 위해 '=' 추가
    const padding = base64.length % 4;
    if (padding > 0) {
        base64 += '='.repeat(4 - padding);
    }

    // Base64 디코딩 후 UTF-8로 변환
    const decoded = atob(base64);
    return decodeURIComponent(escape(decoded));
}

export function isTokenValid(token) {
    if (!token) {
        return false; // 토큰이 없으면 만료로 간주
    }else{
        const decodedPayload = getTokenData(token);
        if(validateTimeAccesstoken(token)){
            return true;
        }else if(validateTimeRefreshtoken(decodedPayload.user.id) && !validateTimeAccesstoken(token)){
            // Refreshtoken을 통해 Accesstoken을 재발급한다.
            return getAccesstokenWithRefreshtoken(decodedPayload.user.id);
        }else if(!validateTimeRefreshtoken(decodedPayload.user.id)){ 
            return false;
        }else{
            // console.log("이건 무슨경우?");
            return false;
        }
    }

   
/*
    // 만료 시간 확인
    const currentTime = Math.floor(Date.now() / 1000); // 현재 시간을 초 단위로
    console.log(currentTime);
    return decodedPayload.exp < currentTime; // 만료 여부 반환
    */
}
export const validateTimeAccesstoken = (accessToken) => {
    // sessionStorage에서 accessToken을 가져온다.
  //  const accessToken = sessionStorage.getItem('accessToken');
    //console.log("accessToken :: ",accessToken)
    // jwt를 decode 하여 payload를 추출한다.
    const decodePayload = getTokenData(accessToken, {payload: true});
  //console.log(decodePayload.exp);
    // exp가 UNIX Time으로 나오기 때문에 변환을 해준다.
    var exp = (new Date(decodePayload.exp * 1000).getTime());
    var now = new Date().getTime();
    //console.log(accessToken);
    //console.log(exp);
    // 변환된 값을 비교하고 Boolean type을 반환한다.
    if(now < exp){
      //console.log("AccessToken is valid");
      return true;
    } else {
      //console.log("AccessToken is invalid");
      return false;
    }
}

export const validateTimeRefreshtoken = async(userId) => {
    //console.log("validateTimeRefreshtoken :: ",userId)
    var ajaxList = new Array();
    var jsonObj = new Object();
    jsonObj.userId = userId;
    ajaxList.push(jsonObj);

   
    const resp = await fetch('/api/getRefreshToken', {
        method: "POST",
        headers : {
            "Content-Type" : "application/json;charset=utf-8;"
        }, 
        body : JSON.stringify(ajaxList)
    });
    //console.log(resp);
    // sessionStorage에서 accessToken을 가져온다.
    //const refrashToken = sessionStorage.getItem('refrashToken');
    
    const data = await resp.json();
    const refreshToken = data.refreshToken;

    // jwt를 decode 하여 payload를 추출한다.
    const decodePayload = getTokenData(refreshToken);
  
    // exp가 UNIX Time으로 나오기 때문에 변환을 해준다.
    var exp = (new Date(decodePayload.exp * 1000).getTime());
    var now = new Date().getTime();
  
    // 변환된 값을 비교하고 Boolean type을 반환한다.
    if(now < exp){
      //console.log("refrashToken is valid");
      return true;
    } else {
      //console.log("refrashToken is invalid");
      return false;
    }
}


export const getAccesstokenWithRefreshtoken = async(userId) => {
    var ajaxList = new Array();
    var jsonObj = new Object();
    jsonObj.userId = userId;
    ajaxList.push(jsonObj);

    const resp = await fetch('/api/getAccesstokenWithRefreshtoken', {
        method: "POST",
        headers : {
            "Content-Type" : "application/json;charset=utf-8;"
        }, 
        body : JSON.stringify(ajaxList)
    });
    const data = await resp.json();
   // console.log(resp);
    //console.log("성공 : ",resp);
    if(resp.status == 200){
        console.log('[Inteceptors.Response] got succeed');
        sessionStorage.setItem('accessToken', data.accessToken);
    
        return true;
    }else if(resp.status == 202){
        //console.log("202error", data)
        return false;
    }
    
}

export const getUserPermission = (token) => {
    if (!token) return [];
    
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.permission || [];
};
export const getUserRoles = (token) => {
    if (!token) return [];
    
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.roles || [];
};


export const writePermissionCheck = (token, menuCd) => {
    const roles = getUserPermission(token);
    const hasRequiredRole = roles.some(r => r.menuCd === menuCd && r.write === '1');
  
    return hasRequiredRole;
}

export const deletePermissionCheck = (token, menuCd) => {
    const roles = getUserPermission(token);
    //console.log(roles);
    const hasRequiredRole = roles.some(r => r.menuCd === menuCd && r.delete === '1');
  
    return hasRequiredRole;
}