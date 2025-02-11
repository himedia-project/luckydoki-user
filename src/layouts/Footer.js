import React from "react";
import style from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <div className={style.footer}>
      <div className={style.footer_top}>
        <ul>
          <li className={style.footer_menu}>
            <ul>
              <li>
                <b>이용안내</b>
              </li>
              <li>
                <p>검수기준</p>
              </li>
              <li>
                <p>이용정책</p>
              </li>
              <li>
                <p>패널티정책</p>
              </li>
              <li>
                <p>커뮤니티 가이드라인</p>
              </li>
            </ul>
            <ul>
              <li>
                <b>고객지원</b>
              </li>
              <li>
                <p>공지사항</p>
              </li>
              <li>
                <p>서비스 소개</p>
              </li>
              <li>
                <p>스토어 안내</p>
              </li>
              <li>
                <p>판매자 방문접수</p>
              </li>
            </ul>
          </li>
        </ul>
        <ul className={style.cs_num}>
          <li className={style.title}>
            <strong>고객센터 1588-7813</strong>
          </li>
          <li className={style.time}>
            운영시간 평일 10:00 - 18:00 (토∙일, 공휴일 휴무)
            <br /> 점심시간 평일 13:00 - 14:00
          </li>
          <li className={style.desc}>1:1 문의하기는 앱에서만 가능합니다.</li>
          <li className={style.faq}>자주 묻는 질문</li>
        </ul>
      </div>
      <div className={style.footer_middle}>
        <ul className={style.policy}>
          <li>회사소개</li>
          <li>인재채용</li>
          <li>제휴제안</li>
          <li>이용약관</li>
          <li>
            <strong>개인정보처리방침</strong>
          </li>
        </ul>
        <ul className={style.info}>
          <li>
            <span>럭키도키 주식회사 · 대표 도성곤</span>
          </li>
          <li>
            <span>
              사업자등록번호 : 570-88-01618{" "}
              <span className={style.ad}>사업자정보확인</span>
            </span>
          </li>
          <li>
            <span>통신판매업 : 제 2021-성남분당C-0093호</span>
          </li>
          <li>
            <span>
              사업장소재지 : 경기도 성남시 분당구 분당내곡로 131 판교테크원
              타워1, 8층
            </span>
          </li>
          <li>
            <span>호스팅 서비스 : 네이버 클라우드 ㈜</span>
          </li>
        </ul>
      </div>
      <div className={style.footer_bottom}>
        <div>
          <ul>
            <li>
              <strong>신한은행 채무지급보증 안내</strong>
            </li>
            <li>
              당사는 고객님의 현금 결제 금액에 대해 신한은행과 채무지급보증
              계약을 체결하여 안전거래를 보장하고 있습니다.
              <span>서비스가입 사실 확인</span>
            </li>
          </ul>
          <p>
            럭키도키(주)는 통신판매 중개자로서 통신판매의 당사자가 아닙니다. 본
            상품은 개별판매자가 등록한 상품으로 상품, 상품정보, 거래에 관한
            의무와 책임은 각 판매자에게 있습니다. 단, 이용약관 및 정책, 기타
            거래 체결 과정에서 고지하는 내용 등에 따라 검수하고 보증하는 내용에
            대한 책임은 크림(주)에 있습니다.
          </p>
        </div>
        <p className={style.copyright}>© LuckyDoki Corp.</p>
      </div>
    </div>
  );
}
