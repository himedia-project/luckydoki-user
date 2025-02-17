import React from "react";
import { useLocation } from "react-router-dom";

export default function MessagePage() {
  const location = useLocation();
  console.log("Received state:", location.state);

  return (
    <div>
      <h1>Message Page</h1>
      {location.state ? (
        <div>
          <p>Shop ID: {location.state.shopId}</p>
          <p>Shop Image: {location.state.shopImage}</p>
          <p>Shop Name: {location.state.shopName}</p>
        </div>
      ) : (
        <p>No state was passed.</p>
      )}
    </div>
  );
}
