import DynamicBreadcrumbs, { BreadcrumbsItem } from "@/components/DynamicBreadcrumbs";
import ProductCardList from "@/components/ProductCardList";
import ProductCardListSkeleton from "@/components/ProductCardList/ProductCardListSkeleton";
import { BreakpointsContext } from "@/contexts/breakpoints";
import LayoutContainer from "@/layouts/ClientLayout/LayoutContainer";
import { useCountAllProductsQuery, useGetNewProductsQuery } from "@/redux/apis/productApi";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import { useContext, useState } from "react";

const pageSize = 12;

const breadcrumbsItems: BreadcrumbsItem[] = [
  {
    to: "/products",
    label: "Products",
  },
  {
    icon: <NewReleasesIcon />,
    label: "New Collection",
  },
];

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
        <DynamicBreadcrumbs items={breadcrumbsItems} />
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
