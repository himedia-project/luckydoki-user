import React, { useState } from "react";
import style from "../styles/ProductSelect.module.css";

const ProductSelect = ({ products, onSelect, selectedProducts }) => {
  const [selectedProduct, setSelectedProduct] = useState("");

  const handleChange = (e) => {
    const productId = parseInt(e.target.value);
    if (!productId) return;

    const selected = products.find((product) => product.id === productId);
    if (selected && !selectedProducts.some((p) => p.id === selected.id)) {
      onSelect(selected);
      setSelectedProduct("");
    }
  };

  return (
    <div className={style.select_container}>
      <label className={style.label}>태그 상품</label>
      <select
        className={style.select_box}
        value={selectedProduct}
        onChange={handleChange}
      >
        <option value="">상품을 선택해주세요.</option>
        {products
          .filter(
            (product) => !selectedProducts.some((p) => p.id === product.id)
          )
          .map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
      </select>
    </div>
  );
};

export default ProductSelect;
