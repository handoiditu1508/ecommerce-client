import { currentUrlWithPage } from "@/common/url";
import ProductCardList from "@/components/ProductCardList";
import { BreakpointsContext } from "@/contexts/breakpoints";
import { GetNewProductsQuery } from "@/models/apis/product/getNewProducts";
import { useCountAllProductsQuery, useGetNewProductsQuery } from "@/redux/apis/productApi";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { useContext, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

const PAGE_SIZE = 20;

function NewProductsPage() {
  const { xsAndDown } = useContext(BreakpointsContext);
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")!) || 1;
  const countAllProductsResult = useCountAllProductsQuery();
  const getNewProductsQuery = useMemo<GetNewProductsQuery>(() => ({ page, pageSize: PAGE_SIZE }), [page]);
  const getNewProductsResult = useGetNewProductsQuery(getNewProductsQuery);
  const totalPage = countAllProductsResult.data !== undefined ? Math.ceil(countAllProductsResult.data / PAGE_SIZE) : 1;

  return (
    <>
      <ProductCardList products={getNewProductsResult.data} loading={getNewProductsResult.isFetching} />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPage}
          color="primary"
          showFirstButton={!xsAndDown}
          hidePrevButton={xsAndDown}
          hideNextButton={xsAndDown}
          showLastButton={!xsAndDown}
          page={page}
          disabled={countAllProductsResult.isLoading}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={currentUrlWithPage(item.page)}
              {...item}
            />
          )}
        />
      </Box>
    </>
  );
}

export default NewProductsPage;
