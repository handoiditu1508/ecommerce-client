import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import LayoutContainer from "@/layouts/ClientLayout/LayoutContainer";
import { GetDiscountedProductsQuery } from "@/models/apis/product/getDiscountedProducts";
import { GetLatestProductsQuery } from "@/models/apis/product/getLatestProducts";
import { useGetDiscountedProductsQuery, useGetLatestProductsQuery } from "@/redux/apis/productApi";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import PromotionalProductList from "./PromotionalProductList";
import TopBrandsCarousel from "./TopBrandsCarousel";

const getLatestProductsQuery: GetLatestProductsQuery = { pageSize: 12 };
const getDiscountedProductsQuery: GetDiscountedProductsQuery = { pageSize: 12 };

function HomePage() {
  const theme = useTheme();
  const { t } = useTranslation("main");
  const getLatestProductsResult = useGetLatestProductsQuery(getLatestProductsQuery);
  const getDiscountedProductsResult = useGetDiscountedProductsQuery(getDiscountedProductsQuery);

  return (
    <>
      <LayoutContainer>
        <Box sx={{
          display: "flex",
          aspectRatio: "3 / 1",
          gap: 1,
          [smAndDownMediaQuery(theme.breakpoints)]: {
            flexDirection: "column",
            aspectRatio: "3 / 2",
          },
        }}>
          <Box
            sx={{
              flexGrow: 2,
            }}
            style={{
              backgroundImage: 'url("https://placehold.co/600x400")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            flexGrow: 1,
            [smAndDownMediaQuery(theme.breakpoints)]: {
              flexDirection: "row",
            },
          }}>
            <Box
              sx={{
                flexGrow: 1,
                backgroundImage: 'url("https://placehold.co/600x400")',
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Box
              sx={{
                flexGrow: 1,
                backgroundImage: 'url("https://placehold.co/600x400")',
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </Box>
        </Box>
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
