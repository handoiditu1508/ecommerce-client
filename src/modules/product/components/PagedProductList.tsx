import { currentUrlWithPage } from "@/common/url";
import ProductCardList from "@/components/ProductCardList";
import { BreakpointsContext } from "@/contexts/breakpoints";
import { ProductView } from "@/models/entities/Product";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { useContext } from "react";
import { Link } from "react-router-dom";

type PagedProductListProps = {
  products?: ProductView[];
  loading?: boolean;
  count?: number;
  page: number;
  pageSize: number;
};

function PagedProductList({ products, loading, count, page, pageSize }: PagedProductListProps) {
  const { xsAndDown } = useContext(BreakpointsContext);
  const totalPage = count !== undefined ? Math.ceil(count / pageSize) : 1;

  return (
    <>
      <ProductCardList products={products} loading={loading} />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPage}
          color="primary"
          showFirstButton={!xsAndDown}
          hidePrevButton={xsAndDown}
          hideNextButton={xsAndDown}
          showLastButton={!xsAndDown}
          page={page}
          disabled={count === undefined}
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

export default PagedProductList;
