import ProductCardList from "@/components/ProductCardList";
import { BreakpointsContext } from "@/contexts/breakpoints";
import { GetNewProductsQuery } from "@/models/apis/product/getNewProducts";
import { useCountAllProductsQuery, useGetNewProductsQuery } from "@/redux/apis/productApi";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import { useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const pageSize = 12;

function NewProductsPage() {
  const { xsAndDown } = useContext(BreakpointsContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")!) || 1;
  const countAllProductsResult = useCountAllProductsQuery();
  const getNewProductsQuery = useMemo<GetNewProductsQuery>(() => ({ page, pageSize }), [page]);
  const getNewProductsResult = useGetNewProductsQuery(getNewProductsQuery);
  const totalPage = countAllProductsResult.data !== undefined ? Math.ceil(countAllProductsResult.data / pageSize) : 1;

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setSearchParams({ page: page.toString() });
  };

  return (
    <>
      <ProductCardList products={getNewProductsResult.data} />
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
          onChange={handlePageChange}
        />
      </Box>
    </>
  );
}

export default NewProductsPage;
