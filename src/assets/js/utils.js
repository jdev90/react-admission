/**
 * 메뉴코드를 통해 메뉴정보를 조회한다
 * @param {*} link 
 * @returns 
 */
export const getMenuInfo = (link) => {
    const raw = sessionStorage.getItem('menuList'); // 문자열
    let menuList = [];
    if (raw) {
      try {
        menuList = JSON.parse(raw);     // => 배열
      } catch (err) {
        console.error('menuList JSON 파싱 실패', err);
      }
    }
    const hasRequiredRole = menuList.filter(r => r.LINK == link);
    return hasRequiredRole[0];
};
