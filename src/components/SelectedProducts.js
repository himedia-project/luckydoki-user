import React from "react";
import style from "../styles/SelectedProducts.module.css";

const SelectedProducts = ({ selectedProducts, onRemove }) => {
  return (
    <div className={style.product_list}>
      {selectedProducts.map((product) => (
        <div key={product.id} className={style.product_box}>
          <img
            src={product.image}
            alt={product.name}
            className={style.product_image}
          />
          <div className={style.product_info}>
            <p className={style.product_name}>{product.name}</p>
            <p className={style.product_price}>
              {product.price.toLocaleString()}원
            </p>
          </div>
          <button
            className={style.remove_button}
            onClick={() => onRemove(product.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default SelectedProducts;
