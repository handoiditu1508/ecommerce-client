import DynamicBreadcrumbs, { BreadcrumbsItem } from "@/components/DynamicBreadcrumbs";
import MdiSvgIcon from "@/components/MdiSvgIcon";
import ProductCardList from "@/components/ProductCardList";
import ProductCardListSkeleton from "@/components/ProductCardList/ProductCardListSkeleton";
import { BreakpointsContext } from "@/contexts/breakpoints";
import LayoutContainer from "@/layouts/ClientLayout/LayoutContainer";
import { useCountDiscountedProductsQuery, useGetDiscountedProductsQuery } from "@/redux/apis/productApi";
import { mdiSale } from "@mdi/js";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import React, { useContext, useState } from "react";

const pageSize = 12;

const breadcrumbsItems: BreadcrumbsItem[] = [
  {
    to: "/products",
    label: "Products",
  },
  {
    icon: <MdiSvgIcon path={mdiSale} />,
    label: "Discount",
  },
];

function DiscountedProductsPage() {
  const { xsAndDown } = useContext(BreakpointsContext);
  const [page, setPage] = useState(1);
  const countDiscountedProductsResult = useCountDiscountedProductsQuery();
  const getDiscountedProductsResult = useGetDiscountedProductsQuery({ page, pageSize });
  const totalPage = countDiscountedProductsResult.data !== undefined ? Math.ceil(countDiscountedProductsResult.data / pageSize) : 1;

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setPage(page);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <LayoutContainer disableGutters={false}>
        <DynamicBreadcrumbs items={breadcrumbsItems} />
      </LayoutContainer>
      {(countDiscountedProductsResult.isLoading || getDiscountedProductsResult.isLoading) && <ProductCardListSkeleton quantity={12} />}
      {getDiscountedProductsResult.data && <ProductCardList products={getDiscountedProductsResult.data} />}
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

export default DiscountedProductsPage;
