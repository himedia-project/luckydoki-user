import React from "react";
import style from "../styles/SelectedProducts.module.css";
import ImageLoader from "./card/ImageLoader";

const SelectedProducts = ({ selectedProducts, onRemove }) => {
  return (
    <div className={style.product_list}>
      {selectedProducts.map((product) => (
        <div key={product.id} className={style.product_box}>
          <ImageLoader
            imagePath={product.uploadFileNames[0]}
            alt={product.name}
            className={style.product_image}
          />
          <div className={style.product_info}>
            <p className={style.product_name}>{product.name}</p>
            {product.discountRate > 0 && (
              <div className={style.rateBox}>
                <b className={style.rate}>{product.discountRate}%</b>
                <b className={style.price}>
                  {product.price?.toLocaleString()}
                  <span className={style.won}>원</span>
                </b>
              </div>
            )}
            <b className={style.discountPrice}>
              {product.discountPrice?.toLocaleString()}
              <span className={style.won2}>원</span>
            </b>
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
