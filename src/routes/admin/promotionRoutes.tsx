import Policy from "@/models/Policy";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RedeemIcon from "@mui/icons-material/Redeem";
import SellIcon from "@mui/icons-material/Sell";
import React from "react";
import { RouteObject } from "react-router-dom";
import { RouteHandleObject } from "../models";

const ProductDiscountsPage = React.lazy(() => import("@/modules/admin/promotion/pages/productDiscount/ProductDiscountsPage"));
const CreateProductDiscountPage = React.lazy(() => import("@/modules/admin/promotion/pages/productDiscount/CreateProductDiscountPage"));
const UpdateProductDiscountPage = React.lazy(() => import("@/modules/admin/promotion/pages/productDiscount/UpdateProductDiscountPage"));

const InvoiceDiscountsPage = React.lazy(() => import("@/modules/admin/promotion/pages/invoiceDiscount/InvoiceDiscountsPage"));
const CreateInvoiceDiscountPage = React.lazy(() => import("@/modules/admin/promotion/pages/invoiceDiscount/CreateInvoiceDiscountPage"));
const UpdateInvoiceDiscountPage = React.lazy(() => import("@/modules/admin/promotion/pages/invoiceDiscount/UpdateInvoiceDiscountPage"));

const GiftPromotionsPage = React.lazy(() => import("@/modules/admin/promotion/pages/giftPromotion/GiftPromotionsPage"));
const CreateGiftPromotionPage = React.lazy(() => import("@/modules/admin/promotion/pages/giftPromotion/CreateGiftPromotionPage"));
const UpdateGiftPromotionPage = React.lazy(() => import("@/modules/admin/promotion/pages/giftPromotion/UpdateGiftPromotionPage"));

const promotionRoutes: RouteObject[] = [
  {
    path: "promotions",
    children: [
      {
        path: "product-discounts",
        handle: {
          crumb: { label: "Product discounts", icon: <SellIcon />, to: "/admin/promotions/product-discounts" },
        } as RouteHandleObject,
        children: [
          {
            index: true,
            element: <ProductDiscountsPage />,
            handle: { policies: [Policy.ViewPromotion] } as RouteHandleObject,
          },
          {
            path: "new",
            element: <CreateProductDiscountPage />,
            handle: {
              crumb: { label: "Create product discount", icon: <AddCircleIcon /> },
              policies: [Policy.CreatePromotion],
            } as RouteHandleObject,
          },
          {
            path: ":id",
            element: <UpdateProductDiscountPage />,
            handle: {
              crumb: { label: "Update product discount", icon: <EditIcon /> },
              policies: [Policy.UpdatePromotion],
            } as RouteHandleObject,
          },
        ],
      },
      {
        path: "invoice-discounts",
        handle: {
          crumb: { label: "Invoice discounts", icon: <ReceiptLongIcon />, to: "/admin/promotions/invoice-discounts" },
        } as RouteHandleObject,
        children: [
          {
            index: true,
            element: <InvoiceDiscountsPage />,
            handle: { policies: [Policy.ViewPromotion] } as RouteHandleObject,
          },
          {
            path: "new",
            element: <CreateInvoiceDiscountPage />,
            handle: {
              crumb: { label: "Create invoice discount", icon: <AddCircleIcon /> },
              policies: [Policy.CreatePromotion],
            } as RouteHandleObject,
          },
          {
            path: ":id",
            element: <UpdateInvoiceDiscountPage />,
            handle: {
              crumb: { label: "Update invoice discount", icon: <EditIcon /> },
              policies: [Policy.UpdatePromotion],
            } as RouteHandleObject,
          },
        ],
      },
      {
        path: "gift-promotions",
        handle: {
          crumb: { label: "Gift promotions", icon: <RedeemIcon />, to: "/admin/promotions/gift-promotions" },
        } as RouteHandleObject,
        children: [
          {
            index: true,
            element: <GiftPromotionsPage />,
            handle: { policies: [Policy.ViewPromotion] } as RouteHandleObject,
          },
          {
            path: "new",
            element: <CreateGiftPromotionPage />,
            handle: {
              crumb: { label: "Create gift promotion", icon: <AddCircleIcon /> },
              policies: [Policy.CreatePromotion],
            } as RouteHandleObject,
          },
          {
            path: ":id",
            element: <UpdateGiftPromotionPage />,
            handle: {
              crumb: { label: "Update gift promotion", icon: <EditIcon /> },
              policies: [Policy.UpdatePromotion],
            } as RouteHandleObject,
          },
        ],
      },
    ],
  },
];

export default promotionRoutes;
