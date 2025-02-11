import React from "react";
import style from "../../styles/Notice.module.css";

export default function NoticePage() {
  return (
    <div className={style.notice_container}>
      <h2>알림 내역</h2>
      <div className={style.content_box}>
        <p>알림 내역이 없습니다.</p>
      </div>
    </div>
  );
}
