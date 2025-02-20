import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "../styles/SearchPage.module.css";
import { searchProduct, searchCommunity } from "../api/searchApi";
import ProductCard from "../components/card/ProductCard";
import CommunityCard from "../components/card/CommunityCard";
import { IoSearchSharp } from "react-icons/io5";
import RecentSearchDropdown from "../components/dropdown/RecentSearchDropdown"; // 추가

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [productResults, setProductResults] = useState([]);
  const [communityResults, setCommunityResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState("product");

  const [searchParams, setSearchParams] = useSearchParams();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 최근 검색어 드롭다운 상태

  useEffect(() => {
    if (!searchParams.get("searchKeyword")) {
      setKeyword("");
      setProductResults([]);
      setCommunityResults([]);
      setHasSearched(false);
      setActiveTab("product");
    }
  }, [searchParams]);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      if (keyword.trim() === "") return;
      setSearchParams({ searchKeyword: keyword });

      try {
        const productResponse = await searchProduct(keyword);
        setProductResults(productResponse.data);

        const communityResponse = await searchCommunity(keyword);
        setCommunityResults(communityResponse.data);

        setHasSearched(true);
        setActiveTab("product");
        window.scrollTo({ top: 0 });

        // 🔥 최근 검색어 저장
        saveRecentSearch(keyword);

        // 🔥 검색 후 input 포커스 제거 + 드롭다운 닫기
        e.target.blur();
        setIsDropdownOpen(false);
      } catch (error) {
        console.error("검색 실패:", error);
      }
    }
  };
  let blurTimeout; // 🔥 마우스 벗어날 때 닫는 타이머 변수

  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      console.log("검색창 포커스 해제 대기 중...");
      blurTimeout = setTimeout(() => {
        console.log("검색창 포커스 해제됨");
        setIsDropdownOpen(false);
      }, 300); // 🔥 300ms 후 닫힘
    }
  };

  const handleFocus = () => {
    clearTimeout(blurTimeout); // 🔥 포커스 시 타이머 취소
    setIsDropdownOpen(true);
  };

  const handleMouseEnter = () => {
    clearTimeout(blurTimeout); // 🔥 마우스가 돌아오면 닫는 타이머 취소
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    blurTimeout = setTimeout(() => {
      console.log("드롭다운 닫힘");
      setIsDropdownOpen(false);
    }, 200); // 🔥 300ms 후 닫힘
  };

  const saveRecentSearch = (searchKeyword) => {
    const savedSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    if (!savedSearches.includes(searchKeyword)) {
      const updatedSearches = [searchKeyword, ...savedSearches.slice(0, 4)];
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    }
  };
  const handleSearch = async (searchKeyword) => {
    if (searchKeyword.trim() === "") return;
    setSearchParams({ searchKeyword });

    try {
      const productResponse = await searchProduct(searchKeyword);
      setProductResults(productResponse.data);

      const communityResponse = await searchCommunity(searchKeyword);
      setCommunityResults(communityResponse.data);

      setHasSearched(true);
      setActiveTab("product");
      window.scrollTo({ top: 0 });

      // 🔥 최근 검색어 저장
      saveRecentSearch(searchKeyword);
    } catch (error) {
      console.error("검색 실패:", error);
    }
  };

  return (
    <div className={styles.container}>
      {/* 검색어 입력 */}
      <div
        tabIndex={0}
        onMouseLeave={handleMouseLeave}
        className={styles.inputBox}
      >
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          tabIndex={0}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter} // 🔥 마우스가 다시 오면 드롭다운 열기
          onKeyDown={handleKeyDown}
          className={styles.searchInput}
        />
        <IoSearchSharp className={styles.searchIcon} />

        {/* 최근 검색어 드롭다운 */}
        {isDropdownOpen && (
          <RecentSearchDropdown
            keyword={keyword}
            setKeyword={setKeyword}
            onSearch={handleSearch} // 🔥 handleSearch를 직접 전달하여 검색 실행
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          />
        )}
      </div>

      {/* 검색 전 상태 */}
      {!hasSearched && <div className={styles.beforeSearch}></div>}

      {/* 검색 후 탭 & 결과 목록 */}
      {hasSearched && (
        <div className={styles.afterSearch}>
          {/* 탭 영역 */}
          <div className={styles.tabContainer}>
            <button
              onClick={() => setActiveTab("product")}
              className={activeTab === "product" ? styles.activeTab : ""}
            >
              상품
            </button>
            <button
              onClick={() => setActiveTab("community")}
              className={activeTab === "community" ? styles.activeTab : ""}
            >
              커뮤니티
            </button>
            {/* 인디케이터 */}
            <div
              className={styles.tabIndicator}
              style={{ left: activeTab === "product" ? "0%" : "50%" }}
            />
          </div>

          {/* 탭별 검색 결과 */}
          {activeTab === "product" && (
            <div className={styles.productList}>
              {productResults.length === 0 ? (
                <p>검색 결과가 없습니다.</p>
              ) : (
                productResults.map((item) => (
                  <ProductCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    discountPrice={item.discountPrice}
                    discountRate={item.discountRate}
                    productImageUrl={item.uploadFileNames[0]}
                    likes={item.likes}
                    isNew={item.isNew}
                    event={item.event}
                    best={item.best}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === "community" && (
            <div className={styles.communityList}>
              {communityResults.length === 0 ? (
                <p>검색 결과가 없습니다.</p>
              ) : (
                <div className={styles.communityGridWrapper}>
                  {/* 좌측 섹션 */}
                  <div className={styles.communityGridLeft}>
                    {communityResults
                      .slice(0, Math.ceil(communityResults.length / 2))
                      .map((post) => (
                        <CommunityCard
                          key={post.id}
                          id={post.id}
                          title={post.title}
                          content={post.content}
                          createdAt={post.createdAt}
                          nickName={post.nickName}
                          uploadFileNames={post.uploadFileNames}
                          productDTOs={post.productDTOs}
                          sellerImage={post.shopImage || null}
                        />
                      ))}
                  </div>
                  {/* 우측 섹션 */}
                  <div className={styles.communityGridRight}>
                    {communityResults
                      .slice(Math.ceil(communityResults.length / 2))
                      .map((post) => (
                        <CommunityCard
                          key={post.id}
                          id={post.id}
                          title={post.title}
                          content={post.content}
                          createdAt={post.createdAt}
                          nickName={post.nickName}
                          uploadFileNames={post.uploadFileNames}
                          productDTOs={post.productDTOs}
                          sellerImage={post.shopImage || null}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
