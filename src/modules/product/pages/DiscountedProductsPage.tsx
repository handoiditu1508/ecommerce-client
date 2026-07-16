import { currentUrlWithPage } from "@/common/url";
import ProductCardList from "@/components/ProductCardList";
import { BreakpointsContext } from "@/contexts/breakpoints";
import { GetDiscountedProductsQuery } from "@/models/apis/product/getDiscountedProducts";
import { useCountDiscountedProductsQuery, useGetDiscountedProductsQuery } from "@/redux/apis/productApi";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { useContext, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

const PAGE_SIZE = 20;

function DiscountedProductsPage() {
  const { xsAndDown } = useContext(BreakpointsContext);
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")!) || 1;
  const countDiscountedProductsResult = useCountDiscountedProductsQuery();
  const getDiscountedProductsQuery = useMemo<GetDiscountedProductsQuery>(() => ({ page, pageSize: PAGE_SIZE }), [page]);
  const getDiscountedProductsResult = useGetDiscountedProductsQuery(getDiscountedProductsQuery);
  const totalPage = countDiscountedProductsResult.data !== undefined ? Math.ceil(countDiscountedProductsResult.data / PAGE_SIZE) : 1;

  return (
    <>
      <ProductCardList products={getDiscountedProductsResult.data} loading={getDiscountedProductsResult.isLoading} />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPage}
          color="primary"
          showFirstButton={!xsAndDown}
          hidePrevButton={xsAndDown}
          hideNextButton={xsAndDown}
          showLastButton={!xsAndDown}
          page={page}
          disabled={countDiscountedProductsResult.isLoading}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={currentUrlWithPage(item.page).toString()}
              preventScrollReset
              {...item}
            />
          )}
        />
      </Box>
    </>
  );
}

export default DiscountedProductsPage;
