import MdiSvgIcon from "@/components/MdiSvgIcon";
import { mdiSale } from "@mdi/js";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import React from "react";
import { Outlet, RouteObject } from "react-router-dom";
import { RouteHandleObject } from "./models";

const CartPage = React.lazy(() => import("@/modules/Product/pages/CartPage"));
const ProductDetailPage = React.lazy(() => import("@/modules/Product/pages/ProductDetailPage"));
const ProductsPage = React.lazy(() => import("@/modules/Product/pages/ProductsPage"));
const NewProductsPage = React.lazy(() => import("@/modules/Product/pages/NewProductsPage"));
const DiscountedProductsPage = React.lazy(() => import("@/modules/Product/pages/DiscountedProductsPage"));

const productRoutes: RouteObject[] = [
  {
    path: "cart",
    element: <CartPage />,
    handle: {
      hideBreadcrumbs: true,
    } as RouteHandleObject,
  },
  {
    path: "products",
    element: <Outlet />,
    handle: {
      crumb: {
        to: "/products",
        label: "Products",
      },
    } as RouteHandleObject,
    children: [
      {
        index: true,
        element: <ProductsPage />,
      },
      {
        path: ":id",
        element: <ProductDetailPage />,
        handle: {
          hideBreadcrumbs: true,
        } as RouteHandleObject,
      },
      {
        path: "new",
        element: <NewProductsPage />,
        handle: {
          crumb: {
            to: "/products/new",
            label: "New Collection",
            icon: <NewReleasesIcon />,
          },
        } as RouteHandleObject,
      },
      {
        path: "discount",
        element: <DiscountedProductsPage />,
        handle: {
          crumb: {
            to: "/products/discount",
            label: "Discount",
            icon: <MdiSvgIcon path={mdiSale} />,
          },
        } as RouteHandleObject,
      },
    ],
  },
];

export default productRoutes;
