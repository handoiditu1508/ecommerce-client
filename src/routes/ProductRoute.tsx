import React from "react";
import { Route } from "react-router-dom";

const CartPage = React.lazy(() => import("@/modules/Product/pages/CartPage"));
const ProductDetailPage = React.lazy(() => import("@/modules/Product/pages/ProductDetailPage"));
const ProductsPage = React.lazy(() => import("@/modules/Product/pages/ProductsPage"));

const ProductRoute = [
  <Route key="cart" path="cart" element={<CartPage />} />,
  <Route key="product-detail" path="products/:id" element={<ProductDetailPage />} />,
  <Route key="products" path="products" element={<ProductsPage />} />,
];

export default ProductRoute;
