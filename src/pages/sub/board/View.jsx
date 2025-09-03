import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { SERVER_URL } from "context/config";
import qs from "qs";

import SubBannerComp from "pages/common/components/subBannerComp";
import ContentMenuComp from 'pages/common/components/contentMenuComp';

// **권한** //
import {writePermissionCheck, deletePermissionCheck, getTokenData, getUserRoles} from "assets/js/jwt";
import {getMenuInfo, getMenuInfoMenuCd} from "assets/js/utils";
// **권한** //

const View = () => {
  /* --------------------------- 기본 훅 --------------------------- */
  const focusRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const menuCd = params.menuCd;
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });

  /* --------------------------- UI 상태 --------------------------- */
  const [delFlag, setDelFlag] = useState(false); // 게시글 삭제 완료 여부
  const [replyFlag, setReplyFlag] = useState(false); // 댓글 등록/삭제 후 재조회 플래그
  const [replyAuth, setReplyAuth] = useState(false); // 비회원 댓글 입력 권한 여부

  // 비밀번호 팝업 상태
  const [PWpop, setPWpop] = useState(false);
  const [PW, setPW] = useState("");
  const [PWbool, setPWbool] = useState(false); // 비밀번호 오류 안내
  const [pendingAct, setPendingAct] = useState(null); // { type, item }

  // 권한 상태
  const [writePermission, setWritePermission] = useState(false);
  const [deletePermission, setDeletePermission] = useState(false);

  /* --------------------------- 데이터 상태 --------------------------- */
  const [postList, setPostList] = useState([]); // 게시글 본문
  const [attachList, setAttachList] = useState([]); // 첨부파일

  const [reply, setReply] = useState("");
  const [replyList, setReplyList] = useState([]);
  const [reply_id, setReply_id] = useState("");

  /* --------------------------- 토큰/유저 --------------------------- */
  const token = window.sessionStorage.getItem("accessToken");
  let userData, roles;
  let menuInfo = getMenuInfoMenuCd(menuCd);

  if (token) {
    userData = getTokenData(token);
    roles = getUserRoles(token);
  }

  /* --------------------------- 초기 로딩 --------------------------- */
  useEffect(() => {
    window.scrollTo(0, 0);
    if (token) {
      setWritePermission(writePermissionCheck(token, menuCd));
      setDeletePermission(deletePermissionCheck(token, menuCd));
    }

    init();

  }, [menuCd, query.boardId]);

  /* 댓글 등록/삭제 후 리스트 재조회 */
  useEffect(() => {
    if (replyFlag) {
      setReply("");
      setReply_id("");
      setReplyFlag(false);
      init();
    }
  }, [replyFlag]);

  /* 게시글·댓글·첨부 조회 */
  const init = async () => {
    try {

      const res = await fetch(SERVER_URL+'/api/board/'+menuCd +'/'+query.boardId +'/view',{method:"GET", headers:{'content-type':'application/json'},});
      const data = await res.json();

      setPostList(data.getBoardView);
      setAttachList(data.getAttachList);
      setReplyList(data.getReplyList);

    } catch (e) {
      console.error(e);
    }
  };

  /* --------------------------- 게시글/댓글 핸들러 --------------------------- */
  /** 파일 다운로드 */
  const handleFileDown = (src) => window.open(src, "self");

  /** 댓글 저장(신규/수정) */
  const replySave = async () => {

    if (!reply.trim()) {
      alert("내용을 작성해주세요.");
      return;
    }

    let JsonArray = new Array();
    let JsonObject = new Object;
    JsonObject.CONTENT = reply;
    token ? JsonObject.USER_ID = userData.user.id : JsonObject.USER_ID = "사용자"
    if(reply_id !== ""){JsonObject.REPLY_ID = reply_id;}
    JsonArray.push(JsonObject);

    const res = await fetch(SERVER_URL+'/api/reply/'+menuCd +'/'+query.boardId +'/write',{method:"POST", headers:{'content-type':'application/json'}, body : JSON.stringify(JsonArray)});
    const data = await res.json();

    if (data?.MSG === "SUCCESS") setReplyFlag(true);

  };

  /** 댓글 수정 진입 */
  const replyModi = (data) => {
    setReply(data.CONTENT);
    setReply_id(data.REPLY_ID);
  };

  /** 댓글 삭제 */
  const replyDel = async (replyid) => {
    if (!window.confirm("댓글을 정말 삭제하시겠습니까?")) return;

    let JsonArray = new Array();
    let JsonObject = new Object;
    JsonObject.REPLY_ID = replyid;
    JsonArray.push(JsonObject);

    const res = await fetch(SERVER_URL+'/api/reply/'+menuCd +'/'+query.boardId +'/delete',{method:"POST", headers:{'content-type':'application/json'}, body : JSON.stringify(JsonArray)});
    const data = await res.json();

    if (data?.MSG === "SUCCESS") setReplyFlag(true);
  };

  /** 게시글 삭제 */
  const handleDelete = async () => {
    if (!window.confirm("삭제된 게시글들은 복구할 수 없습니다.\n게시글을 삭제하시겠습니까?")) return;

    let JsonArray = new Array();
    let JsonObject = new Object;
    JsonObject.MENU_CD = menuCd;
    JsonObject.BOARD_ID = query.boardId;
    JsonArray.push(JsonObject);

    const res = await fetch(SERVER_URL+'/api/board/'+menuCd +'/'+query.boardId +'/delete',{method:"POST", headers:{'content-type':'application/json'}, body : JSON.stringify(JsonArray)});
    const data = await res.json();

    if (data?.MSG === "SUCCESS") setDelFlag(true);
  };

  /* 삭제 완료 시 목록 이동 */
  useEffect(() => {
    if (delFlag) navigate(getMenuInfoMenuCd(query.menuId)?.LINK);
  }, [delFlag]);

  /* --------------------------- 비밀번호 체크 --------------------------- */
  /* 비밀번호 확인 API – 통과 여부 반환 */
  const PWChk = async () => {

    let JsonArray = new Array();
    let JsonObject = new Object;
    JsonObject.BOARD_ID = query.boardId;
    JsonObject.MENU_CD = menuCd;
    JsonObject.PASSWD = PW;
    JsonArray.push(JsonObject);

    const res = await fetch(SERVER_URL+'/api/board/'+query.boardId +'/passChk',{method:"POST", headers:{'content-type':'application/json'}, body : JSON.stringify(JsonArray)});

    const { PASS } = await res.json();
    return PASS === 1;
  };

  /** 팝업 "확인" 버튼 */
  const handlePWConfirm = async () => {
    const ok = await PWChk();
    if (ok) {
      setReplyAuth(true);
      runAction(pendingAct);
      resetPwModal();
    } else {
      setPWbool(true); // 비밀번호 오류
    }
  };

  /** 팝업 닫기 */
  const resetPwModal = () => {
    setPWpop(false);
    setPW("");
    setPWbool(false);
    setPendingAct(null);
  };

  /**
   * 게시물, 댓글(수정, 삭제) 분기
   * @param {{type: string, item?: any}} action
   */
  const runAction = (action) => {
    if (!action) return;

    const { type, item } = action;
    switch (type) {
      case "BoardModify":
        navigate("/board/"+postList[0]?.MENU_CD+"/write?boardId="+postList[0]?.BOARD_ID+"&menuId="+query.menuId);
        break;

      case "BoardDelete":
        handleDelete();
        break;

      case "ReplyModify":
        replyModi(item);
        break;

      case "ReplyDelete":
        replyDel(item?.REPLY_ID);
        break;

      case "input": // 비회원 댓글 입력 권한 얻기
        setReplyAuth(true);
        break;

      default:
        console.warn("알 수 없는 타입", type);
    }
  };

  /**
   * 비밀번호 체크 여부 확인 – 권한 있으면 즉시, 없으면 비밀번호 팝업
   * @param {{type: string, item?: any}} action
   */
  const PWChkPopup = (action) => {
    if (writePermission) {
      runAction(action);
    } else {
      setPendingAct(action);
      setPWpop(true);
    }
  };

  /* 패스워드 팝업 오픈 시 포커싱 */
  useEffect(() => {
    if (PWpop || PWbool) focusRef.current?.focus();
  }, [PWpop, PWbool]);

  /* --------------------------- 기타 유틸 --------------------------- */
  const sanitizeHTML = (html) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    const decoded = textarea.value;
    return decoded
      .replace(/\n/g, " ")
      .replace(/>\s+</g, "><")
      .replace(/\s{2,}/g, " ");
  };

  /* --------------------------- 렌더링 --------------------------- */
  return (
    <>
      <SubBannerComp menuCd={menuCd} />
        <div className='Subcontain'>
          <ContentMenuComp menuCd={query.menuId}/>                          
            <div className='contentBox'>
          {/* ---------------- 게시글 ---------------- */}
          <div className="table_area">
            <table className="comm viewTable">
              <colgroup>
                <col width="30%" />
                <col width="27%" />
                <col width="40%" />
              </colgroup>

              {postList.length > 0 && (
                <>
                  <thead>
                    <tr>
                      <th
                        className="title borR"
                        colSpan={3}
                        dangerouslySetInnerHTML={{
                          __html: postList[0]?.TITLE,
                        }}
                      ></th>
                    </tr>
                  </thead>

                  <tbody>
                    {/* 작성 정보 */}
                    <tr className="row1">
                      <td className="borR">
                        작성자 : <span>{postList[0]?.CREATE_ID}</span>
                      </td>
                      <td className="borR">
                        조회수 : <span>{postList[0]?.HIT}</span>
                      </td>
                      <td className="borR">
                        작성일 :{" "}
                        <span>{postList[0]?.CREATE_DT.slice(0, 11)}</span>
                      </td>
                    </tr>

                    {/* 첨부파일 */}
                    {attachList.length !== 0 && (
                      <tr className="row1">
                        <td className="borR down" colSpan={3}>
                          <div>첨부파일: </div>
                          <div>
                            {attachList.map((file) => (
                              <p
                                key={file.FILE_ID}
                                style={{ cursor: "pointer" }}
                                onClick={() => handleFileDown(SERVER_URL+"/api/attach/download?BOARD_ID="+file.BOARD_ID+"&MENU_CD="+file.MENU_CD+"&FILE_ID="+file.FILE_ID+"&PATH="+file.PATH )}
                              >
                                {file.ORI_FILE_NM}
                              </p>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* 본문 */}
                    <tr className="row2">
                      <td className="borR content ck-content" colSpan={3}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHTML(postList[0]?.CONTENT),
                          }}
                        />

                        {/* 이미지 첨부 자동 노출 */}
                        {attachList.map((file) => {
                          
                          const ex = file.ORI_FILE_NM.slice(
                            file.ORI_FILE_NM.length - 3,
                            file.ORI_FILE_NM.length
                          );
                          const exlist = ["jpg","png","JPG","PNG","JPEG","jpeg","GIF","gif",];
                          const expdf = ["pdf"];
                          // if (!exlist.includes(ex)) return null;
                          // if (!expdf.includes(ex)) return null;
                          // if(!expdf.includes(ex) && !exlist.includes(ex)) return null;
                          if(exlist.includes(ex)){
                            return (
                              <div className="img" key={file.FILE_ID}>
                                <img
                                  src={"https://cfile.cs.ac.kr/upload/fileserver/grad/"+file.PATH+"/"+file.FILE_NM}
                                  alt="행사사진"
                                />
                              </div>
                            );
                          }
                          else if(expdf.includes(ex)){
                            return (
                              <div className="img" key={file.FILE_ID}>
                               {/* <iframe src={"https://cfile.cs.ac.kr/upload/fileserver/grad/"+file.PATH+"/"+file.FILE_NM} type="application/pdf" aria-label="example" width="100%" height="500"/>*/}
                                <iframe src={SERVER_URL+"/api/attach/view?BOARD_ID="+file.BOARD_ID+"&MENU_CD="+file.MENU_CD+"&FILE_ID="+file.FILE_ID+"&PATH="+file.PATH} type="application/pdf" aria-label="example" width="100%" height="500"/>
                              </div>
                            );
                          }
                        })}
                      </td>
                    </tr>
                  </tbody>
                </>
              )}
            </table>

            {/* ---------------- 댓글 ---------------- */}

            {menuInfo?.REPLY == "1" && (
              <>
                <table className="comm viewTable reply">
                  <colgroup>
                    <col width="14%" />
                    <col width="auto" />
                    <col width="5%" />
                  </colgroup>
                  <thead>
                    <tr className="reply_t">
                      <td className="borR" colSpan={3}>
                        댓글({replyList.length})
                      </td>
                    </tr>
                  </thead>

                  <tbody>
                    {replyList.map((data) => (
                      <tr className="reply_a" key={data.REPLY_ID}>
                        <td className="user">
                          <p>{data.CREATE_ID_NM}</p>
                        </td>

                        <td className="ment borR">
                          <div
                            dangerouslySetInnerHTML={{ __html: data.CONTENT }}
                          />
                          <p>
                            {data.LAST_UPDATE_DT === ""
                              ? data.CREATE_DT.slice(0, 16)
                              : data.LAST_UPDATE_DT.slice(0, 16)}
                          </p>
                        </td>

                        {/* 수정/삭제 버튼 */}
                        {data.CREATE_ID !== "사용자" ? (
                          <td className="ment modifi borR borLo">
                            {writePermission ||
                            data.CREATE_ID === userData?.user?.id ? (
                              <>
                                <p onClick={() => replyModi(data)}>수정</p>
                                <p onClick={() => replyDel(data.REPLY_ID)}>삭제</p>
                              </>
                            ) : null}
                          </td>
                        ) : (
                          <td className="ment modifi borR borLo">
                            <p
                              onClick={() =>
                                PWChkPopup({ type: "ReplyModify", item: data })
                              }
                            >
                              수정
                            </p>
                            <p
                              onClick={() =>
                                PWChkPopup({ type: "ReplyDelete", item: data })
                              }
                            >
                              삭제
                            </p>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* 댓글 입력 */}
                {replyAuth || writePermission ? (
                  <div className="comment">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                    ></textarea>
                    <div onClick={replySave}>댓글등록</div>
                  </div>
                ) : (
                  <div colSpan={3} className="authBtn borR" style={{width: '100%', padding: '40px 0', background: '#FFFFFF', color: '#000', boxShadow: '0px 0px 20px -2px #e2e2e2', borderRadius: '20px', border: '0', margin: '30px 0'}}>
                    본인인증 후 댓글 기능을 사용하실 수 있습니다.
                    <div className="viewBtn">
                        <div onClick={() => PWChkPopup({ type: "input" })} style={{transform: 'translateX(-50%)',  left: '50%', position: 'relative'}}>
                        본인 인증하기
                        </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ---------------- 하단 버튼 ---------------- */}
            <div className="viewBtn viewMarB">
              {postList.length > 0 && (
                <>
                  {/* 이전/다음 */}
                  {postList[1]?.BOARD_ID && (
                    <Link to={"?boardId="+postList[1].BOARD_ID+"&menuId="+query.menuId}>
                      <div className="prev">이전</div>
                    </Link>
                  )}
                  {postList[2]?.BOARD_ID && (
                    <Link to={"?boardId="+postList[2].BOARD_ID+"&menuId="+query.menuId}>
                      <div className="next">다음</div>
                    </Link>
                  )}

                  {/* 목록 */}
                  <Link to={getMenuInfoMenuCd(query.menuId)?.LINK}>
                    <div className="list">목록</div>
                  </Link>

                  {/* 수정/삭제 */}
                  {(writePermission ||
                    postList[0]?.CREATE_ID === userData?.user?.id) && (
                    <div
                      className="list"
                      onClick={() => PWChkPopup({ type: "BoardModify" })}
                    >
                      수정
                    </div>
                  )}
                  {(deletePermission ||
                    postList[0]?.CREATE_ID === userData?.user?.id) && (
                    <div
                      className="list"
                      onClick={() => PWChkPopup({ type: "BoardDelete" })}
                    >
                      삭제
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- 비밀번호 팝업 ---------------- */}
      {PWpop && (
        <div className="pw_popup_back">
          <div className="pw_popup">
            <div className="back" onClick={resetPwModal}>
              <img src="/images/sub/content/l_m_close.png" alt="close" />
            </div>

            <h3>게시물 인증</h3>
            {PWbool ? (
              <p className="color">비밀번호를 다시 입력해주세요.</p>
            ) : (
              <p>비밀번호 확인</p>
            )}

            <input
              type="password"
              value={PW}
              onChange={(e) => setPW(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && handlePWConfirm()}
              ref={focusRef}
              placeholder="비밀번호를 입력해 주세요."
            />

            <div className="btn">
              <div className="O" onClick={resetPwModal}>
                취소
              </div>
              <div onClick={handlePWConfirm}>확인</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default View;
