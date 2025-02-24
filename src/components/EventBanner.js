import Marquee from "react-fast-marquee";
import style from "../styles/EventBanner.module.css";

const EventBanner = () => {
  return (
    <Marquee pauseOnHover speed={50} gradient={false}>
      <span style={{ display: "inline-block", marginRight: "140px" }}>
        <span className={style.eventLabel}>[EVENT]</span> 2월 할인 ~77%
      </span>
      <span style={{ display: "inline-block", marginRight: "140px" }}>
        <span className={style.eventLabel}>[EVENT]</span> 새내기를 위한 신학기
        할인 ~78%
      </span>
      <span style={{ display: "inline-block", marginRight: "140px" }}>
        <span className={style.eventLabel}>[EVENT]</span> 나의 아이디어가 작품이
        된다면?
      </span>
      <span style={{ display: "inline-block", marginRight: "140px" }}>
        <span className={style.eventLabel}>[EVENT]</span> 별작가 할인전
      </span>
      <span style={{ display: "inline-block", marginRight: "140px" }}>
        <span className={style.eventLabel}>[EVENT]</span> 아주 보통의 하루를
        만드는 마법
      </span>
      <span style={{ display: "inline-block", marginRight: "140px" }}>
        <span className={style.eventLabel}>[EVENT]</span> 미리 맞이해요 손길로
        피어난 봄
      </span>
    </Marquee>
  );
};

export default EventBanner;
