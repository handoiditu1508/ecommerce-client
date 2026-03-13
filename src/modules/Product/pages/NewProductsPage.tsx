import CustomLink from "@/components/CustomLink";
import ProductCardList from "@/components/ProductCardList";
import ProductCardListSkeleton from "@/components/ProductCardList/ProductCardListSkeleton";
import { BreakpointsContext } from "@/contexts/breakpoints";
import LayoutContainer from "@/layouts/ClientLayout/LayoutContainer";
import { useCountAllProductsQuery, useGetNewProductsQuery } from "@/redux/apis/productApi";
import HomeIcon from "@mui/icons-material/Home";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";

const pageSize = 12;

function NewProductsPage() {
  const { xsAndDown } = useContext(BreakpointsContext);
  const [page, setPage] = useState(1);
  const countAllProductsResult = useCountAllProductsQuery();
  const getNewProductsResult = useGetNewProductsQuery({ page, pageSize });
  const totalPage = countAllProductsResult.data !== undefined ? Math.ceil(countAllProductsResult.data / pageSize) : 1;

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setPage(page);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <LayoutContainer disableGutters={false}>
        <Breadcrumbs aria-label="breadcrumb" maxItems={5}>
          <CustomLink to="/" underline="hover" color="inherit">
            <HomeIcon fontSize="inherit" />
          </CustomLink>
          <CustomLink to="/products" underline="hover" color="inherit">Products</CustomLink>
          <Typography color="textPrimary" display="flex" alignItems="center">
            <NewReleasesIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            New Collection
          </Typography>
        </Breadcrumbs>
      </LayoutContainer>
      {(countAllProductsResult.isLoading || getNewProductsResult.isLoading) && <ProductCardListSkeleton quantity={12} />}
      {getNewProductsResult.data && <ProductCardList products={getNewProductsResult.data} />}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPage}
          color="primary"
          showFirstButton={!xsAndDown}
          hidePrevButton={xsAndDown}
          hideNextButton={xsAndDown}
          showLastButton={!xsAndDown}
          page={page}
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
}

export default NewProductsPage;
