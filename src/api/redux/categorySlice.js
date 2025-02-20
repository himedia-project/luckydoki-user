import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getParentCategory,
  getSubCategories,
  getChildCategories,
} from "../../api/categoryApi";

const topLevelCategory = [1, 3, 4];

// ✅ 최상위 부모 카테고리를 찾는 함수
async function getTopLevelCategory(categoryId) {
  try {
    let currentCategory = await getParentCategory(categoryId);
    if (!currentCategory?.data) throw new Error("부모 카테고리 응답 없음");

    currentCategory = currentCategory.data;

    while (!topLevelCategory.includes(currentCategory.categoryId)) {
      const response = await getParentCategory(currentCategory.categoryId);
      if (!response?.data) break;
      currentCategory = response.data;
    }

    return currentCategory;
  } catch (error) {
    console.error("[Error] getTopLevelCategory 실패:", error);
    throw new Error("최상위 카테고리를 찾을 수 없음");
  }
}

// ✅ 계층 구조 데이터를 불러오는 Thunk
export const fetchCategoryHierarchy = createAsyncThunk(
  "category/fetchCategoryHierarchy",
  async (categoryId, { rejectWithValue }) => {
    try {
      const mainCategory = await getTopLevelCategory(categoryId);

      const subResponse = await getSubCategories(mainCategory.categoryId);
      const subCategories = subResponse.data || [];

      const childPromises = subCategories.map(async (sub) => {
        const childResponse = await getChildCategories(sub.categoryId);
        return { subId: sub.categoryId, children: childResponse.data || [] };
      });
      const childResults = await Promise.all(childPromises);
      const childCategories = {};
      childResults.forEach(({ subId, children }) => {
        childCategories[subId] = children;
      });

      return {
        parent: mainCategory,
        subCategories,
        childCategories,
        defaultExpanded: categoryId, // ✅ 현재 선택된 카테고리를 유지
      };
    } catch (error) {
      return rejectWithValue(
        error.message || "카테고리 데이터를 불러오는 중 오류 발생"
      );
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    parentCategory: null,
    subCategories: [],
    childCategories: {},
    expandedCategories: {},
    status: "idle",
    error: null,
  },
  reducers: {
    setExpandedCategory: (state, action) => {
      const categoryId = action.payload;

      // ✅ 하나의 부모 카테고리만 열리도록 수정
      state.expandedCategories = { [categoryId]: true };
    },

    toggleCategory: (state, action) => {
      const subCategoryId = action.payload;

      // ✅ 현재 상태를 반전 (true → false, false → true)
      state.expandedCategories = {
        ...state.expandedCategories,
        [subCategoryId]: !state.expandedCategories[subCategoryId],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryHierarchy.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategoryHierarchy.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.parentCategory = action.payload.parent;
        state.subCategories = action.payload.subCategories;
        state.childCategories = action.payload.childCategories;
        const selectedCategory = action.payload.defaultExpanded;
        if (selectedCategory) {
          state.expandedCategories = {
            ...state.expandedCategories, // ✅ 기존 상태 유지
            [selectedCategory]: true, // ✅ 새로운 카테고리만 추가
          };
        }
      })
      .addCase(fetchCategoryHierarchy.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { toggleCategory, setExpandedCategory } = categorySlice.actions;
export default categorySlice.reducer;
