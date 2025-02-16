// import React from "react";
// import styles from "./TabMenu.module.css";

// export default function TabMenu({
//   tabs,
//   selectedTab,
//   onTabChange,
//   className = "",
// }) {
//   return (
//     <div className={`${styles.tab_container} ${className}`}>
//       {tabs.map((tab) => (
//         <button
//           key={tab.key}
//           className={selectedTab === tab.key ? styles.activeTab : styles.tab}
//           onClick={() => onTabChange(tab.key)}
//         >
//           {tab.label}
//         </button>
//       ))}
//     </div>
//   );
// }
