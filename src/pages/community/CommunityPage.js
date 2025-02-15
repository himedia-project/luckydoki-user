import React from "react";
import style from "../../styles/CommunityPage.module.css";
import PostAddButton from "../../components//button/PostAddButton";

export default function CommunityPage() {
  return (
    <div className={style.community_container}>
      CommunityPage
      <PostAddButton />
    </div>
  );
}
