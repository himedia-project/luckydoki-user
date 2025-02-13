import { API_URL } from "../config/apiConfig";
import axios from "axios";

const imageCache = new Map();

export const getImageUrl = async (fileUrl) => {
  if (imageCache.has(fileUrl)) {
    return imageCache.get(fileUrl);
  }

  try {
    const response = await axios.get(`${API_URL}/api/image/view/${fileUrl}`, {
      responseType: "blob",
    });
    const imageUrl = URL.createObjectURL(response.data);
    imageCache.set(fileUrl, imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("이미지 로딩 실패:", error);
  }
};
