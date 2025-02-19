import React, { useEffect, useState } from "react";
import styles from "../../styles/RecentSearchDropdown.module.css";
import { MdDeleteOutline } from "react-icons/md";

export default function RecentSearchDropdown({
  keyword,
  setKeyword,
  onSearch,
  isDropdownOpen,
  setIsDropdownOpen,
}) {
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const savedSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(savedSearches);
  }, [keyword]);

  const handleSearchSelect = (selectedKeyword) => {
    setKeyword(selectedKeyword);
    setIsDropdownOpen(false);

    setTimeout(() => {
      onSearch(selectedKeyword);
    }, 0);
  };

  const handleDeleteSearch = (searchToDelete) => {
    const updatedSearches = recentSearches.filter(
      (search) => search !== searchToDelete
    );
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleClearAll = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };
  useEffect(() => {
    console.log("Dropdown open 상태:", isDropdownOpen);
  }, [isDropdownOpen]);

  return (
    <div className={styles.dropdownContainer}>
      {isDropdownOpen && recentSearches.length > 0 && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <span>최근 검색어</span>
            <button className={styles.delete} onClick={handleClearAll}>
              <MdDeleteOutline size={20} /> {/* 🔥 아이콘 사용 */}
            </button>
          </div>
          <ul className={styles.list}>
            {recentSearches.map((search, index) => (
              <li key={index} className={styles.searchItem}>
                <span
                  className={styles.keyword}
                  onClick={() => handleSearchSelect(search)}
                >
                  {search}
                </span>
                <button
                  className={styles.delete}
                  onClick={() => handleDeleteSearch(search)}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
