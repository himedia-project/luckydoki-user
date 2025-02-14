import { API_URL } from "../config/apiConfig";
import axios from "axios";

export const getSellerInfo = async (shopId) => {
  return await axios.get(`${API_URL}/api/shop/${shopId}`);
};
