import { AI_API_SERVER_URL } from "../config/apiConfig";
import axios from "axios";

// 음성 파일을 텍스트로 변환하는 API 함수
export const transcribeAudio = async (audioBlob) => {
  try {
    const formData = new FormData();

    // webm 형식으로 파일 확장자 지정
    formData.append("file", audioBlob, "audio.webm");

    console.log("API 요청 URL:", `${AI_API_SERVER_URL}/api/audio/transcribe`);
    console.log("전송할 오디오 Blob 정보:", {
      타입: audioBlob.type,
      크기: `${(audioBlob.size / 1024).toFixed(2)} KB`,
    });

    // 더 긴 타임아웃 및 오류 처리 강화
    const response = await axios.post(
      `${AI_API_SERVER_URL}/api/audio/transcribe`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 시간 초과 60초로 증가
        onUploadProgress: (progressEvent) => {
          console.log(
            `업로드 진행률: ${Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            )}%`
          );
        },
      }
    );

    console.log("API 응답 상태:", response.status);
    console.log("API 응답 데이터 타입:", typeof response.data);
    console.log("API 응답 데이터:", response.data);

    if (response.status !== 200) {
      throw new Error(`음성 변환 실패 (상태 코드: ${response.status})`);
    }

    return response.data;
  } catch (error) {
    console.error("음성 변환 에러:", error);
    if (error.response) {
      console.error("서버 응답:", error.response.data);
      console.error("상태 코드:", error.response.status);
    } else if (error.request) {
      console.error("응답 없음:", error.request);
    } else {
      console.error("요청 설정 에러:", error.message);
    }
    throw error;
  }
};
