import ProductCardList from "@/components/ProductCardList";
import { BreakpointsContext } from "@/contexts/breakpoints";
import { GetDiscountedProductsQuery } from "@/models/apis/product/getDiscountedProducts";
import { useCountDiscountedProductsQuery, useGetDiscountedProductsQuery } from "@/redux/apis/productApi";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import React, { useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const pageSize = 12;

function DiscountedProductsPage() {
  const { xsAndDown } = useContext(BreakpointsContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")!) || 1;
  const countDiscountedProductsResult = useCountDiscountedProductsQuery();
  const getDiscountedProductsQuery = useMemo<GetDiscountedProductsQuery>(() => ({ page, pageSize }), [page]);
  const getDiscountedProductsResult = useGetDiscountedProductsQuery(getDiscountedProductsQuery);
  const totalPage = countDiscountedProductsResult.data !== undefined ? Math.ceil(countDiscountedProductsResult.data / pageSize) : 1;

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setSearchParams({ page: page.toString() });
  };

  return (
    <>
      <ProductCardList products={getDiscountedProductsResult.data} loading={getDiscountedProductsResult.isFetching} />
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
          onChange={handlePageChange}
        />
      </Box>
    </>
  );
}

export default DiscountedProductsPage;
