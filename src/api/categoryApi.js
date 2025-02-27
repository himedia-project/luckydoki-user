import axiosInstance from "./axiosInstance";

// 해당 카테고리의 부모 카테고리 조회
export const getParentCategory = async (categoryId) => {
  return await axiosInstance.get(`/category/${categoryId}/parent`);
};

// 메인 카테고리 목록 조회
export const getMainCategories = async () => {
  return await axiosInstance.get("/category/main/list");
};

// 서브 카테고리 목록 조회
export const getSubCategories = async (mainCategoryId) => {
  return await axiosInstance.get(`/category/${mainCategoryId}/sub/list`);
};

// 자식 카테고리 목록 조회
export const getChildCategories = async (subCategoryId) => {
  return await axiosInstance.get(`/category/${subCategoryId}/child/list`);
};

// 카테고리별 상품 목록 조회
export const getProductsByCategoryId = async (categoryId) => {
  return await axiosInstance.get(`/category/${categoryId}/product/list`);
};

export const getCategoryHierarchy = async (categoryId) => {
  const parentResponse = await getParentCategory(categoryId);
  const subResponse = await getSubCategories(categoryId);
  const subCategories = subResponse.data || [];

  const childPromises = subCategories.map(async (sub) => {
    const childResponse = await getChildCategories(sub.categoryId);
    return { categoryId: sub.categoryId, children: childResponse.data || [] };
  });

  const childResults = await Promise.all(childPromises);
  const childCategories = {};
  childResults.forEach(({ categoryId, children }) => {
    childCategories[categoryId] = children;
  });

  return {
    data: {
      parent: parentResponse.data,
      subCategories,
      childCategories,
    },
  };
};
