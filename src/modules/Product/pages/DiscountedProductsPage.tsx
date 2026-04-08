import DynamicBreadcrumbs, { BreadcrumbsItem } from "@/components/DynamicBreadcrumbs";
import MdiSvgIcon from "@/components/MdiSvgIcon";
import ProductCardList from "@/components/ProductCardList";
import { BreakpointsContext } from "@/contexts/breakpoints";
import LayoutContainer from "@/layouts/ClientLayout/LayoutContainer";
import { GetDiscountedProductsQuery } from "@/models/apis/product/getDiscountedProducts";
import { useCountDiscountedProductsQuery, useGetDiscountedProductsQuery } from "@/redux/apis/productApi";
import { mdiSale } from "@mdi/js";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import React, { useContext, useMemo, useState } from "react";

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
  const getDiscountedProductsQuery = useMemo<GetDiscountedProductsQuery>(() => ({ page, pageSize }), [page]);
  const getDiscountedProductsResult = useGetDiscountedProductsQuery(getDiscountedProductsQuery);
  const totalPage = countDiscountedProductsResult.data !== undefined ? Math.ceil(countDiscountedProductsResult.data / pageSize) : 1;

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setPage(page);
  };

  return (
    <>
      <LayoutContainer disableGutters={false} sx={{ mt: 2 }}>
        <DynamicBreadcrumbs items={breadcrumbsItems} />
      </LayoutContainer>
      <ProductCardList products={getDiscountedProductsResult.data} />
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
