import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

import { getAccessToken, getMemberWithAccessToken } from "../../api/googleApi";
import { login } from "../../api/redux/loginSlice";
import { setCartEmail, setCartItems } from "../../api/redux/cartSlice";
import {
  setNotificationEmail,
  setNotificationItems,
} from "../../api/redux/notificationSlice";
import { getCartItemList } from "../../api/cartApi";
import {
  getMessageNotificationList,
  getNotificationList,
} from "../../api/notificationApi";
import { setMessageEmail, setMessageItems } from "../../api/redux/messageSlice";

const GoogleRedirectPage = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const authCode = searchParams.get("code");

  useEffect(() => {
    // 구글 로그인 처리
    getAccessToken(authCode).then((accessToken) => {
      console.log("getAccessToken: ", accessToken);
      // 구글 사용자 정보 요청
      getMemberWithAccessToken(accessToken)
        .then(async (memberInfo) => {
          console.log("memberInfo: ", memberInfo);
          // dispatch를 이용하여 login action을 호출
          dispatch(login(memberInfo));
          dispatch(setCartEmail(memberInfo.email));
          dispatch(setNotificationEmail(memberInfo.email));
          dispatch(setMessageEmail(memberInfo.email));

          // 해당 사용자의 데이터 가져오기
          try {
            const cartResponse = await getCartItemList();
            dispatch(setCartItems(cartResponse));

            const notificationResponse = await getNotificationList();
            dispatch(setNotificationItems(notificationResponse));

            const messageResponse = await getMessageNotificationList();
            dispatch(setMessageItems(messageResponse));
          } catch (error) {
            console.error("Failed to fetch user data:", error);
          }

          if (memberInfo) {
            Swal.fire({
              title: "로그인 성공",
              text: "구글 계정으로 로그인되었습니다.",
              icon: "success",
              confirmButtonText: "확인",
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/");
              }
            });
          }
        })
        .catch((error) => {
          console.error("구글 로그인 실패:", error);
          Swal.fire({
            title: "로그인 실패",
            text: "구글 로그인에 실패했습니다.",
            icon: "error",
            confirmButtonText: "확인",
          }).then(() => {
            navigate("/login");
          });
        });
    });
  }, [authCode]);

  return (
    <div>
      <div></div>
    </div>
  );
};

export default GoogleRedirectPage;
