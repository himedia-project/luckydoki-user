// pages/SearchPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "../styles/SearchPage.module.css";
import { searchProduct, searchCommunity } from "../api/searchApi";
import ProductCard from "../components/card/ProductCard";
import CommunityCard from "../components/card/CommunityCard";
import { IoSearchSharp } from "react-icons/io5";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [productResults, setProductResults] = useState([]);
  const [communityResults, setCommunityResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState("product");

  const [searchParams, setSearchParams] = useSearchParams();

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
      } catch (error) {
        console.error("검색 실패:", error);
      }
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.container}>
      {/* 검색어 입력 */}
      <div className={styles.inputBox}>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.searchInput}
        />
        <IoSearchSharp className={styles.searchIcon} />
      </div>

      {/* 검색 전 상태 */}
      {!hasSearched && <div className={styles.beforeSearch}></div>}

      {/* 검색 후 탭 & 결과 목록 */}
      {hasSearched && (
        <div className={styles.afterSearch}>
          {/* 탭 영역 */}
          <div className={styles.tabContainer}>
            <button
              onClick={() => handleTabChange("product")}
              className={activeTab === "product" ? styles.activeTab : ""}
            >
              상품
            </button>
            <button
              onClick={() => handleTabChange("community")}
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
                          sellerImage={post.sellerImage || null}
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
                          sellerImage={post.sellerImage || null}
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
