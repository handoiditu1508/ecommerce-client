import LayoutContainer from "@/layouts/ClientLayout/LayoutContainer";
import { GetDiscountedProductsQuery } from "@/models/apis/product/getDiscountedProducts";
import { GetLatestProductsQuery } from "@/models/apis/product/getLatestProducts";
import { useGetDiscountedProductsQuery, useGetLatestProductsQuery } from "@/redux/apis/productApi";
import { useTranslation } from "react-i18next";
import PromotionalProductList from "./PromotionalProductList";
import PromotionBannerSlider from "./PromotionBannerSlider";
import TopBrandsCarousel from "./TopBrandsCarousel";

const getLatestProductsQuery: GetLatestProductsQuery = { pageSize: 12 };
const getDiscountedProductsQuery: GetDiscountedProductsQuery = { pageSize: 12 };

function HomePage() {
  const { t } = useTranslation("main");
  const getLatestProductsResult = useGetLatestProductsQuery(getLatestProductsQuery);
  const getDiscountedProductsResult = useGetDiscountedProductsQuery(getDiscountedProductsQuery);

  return (
    <>
      <LayoutContainer>
        <PromotionBannerSlider />
      </LayoutContainer>
      <PromotionalProductList
        title={t("new_collection")}
        products={getLatestProductsResult.data}
        loading={getLatestProductsResult.isLoading}
        viewAllUrlPath="/products/latest"
        onRefresh={getLatestProductsResult.refetch}
      />
      <PromotionalProductList
        title={t("popular_products")}
        loading={true}
        viewAllUrlPath="products/popular"
      />
      <PromotionalProductList
        title={t("discount")}
        products={getDiscountedProductsResult.data}
        loading={getDiscountedProductsResult.isLoading}
        viewAllUrlPath="/products/discount"
        onRefresh={getDiscountedProductsResult.refetch}
      />
      <TopBrandsCarousel />
    </>
  );
}

export default HomePage;
