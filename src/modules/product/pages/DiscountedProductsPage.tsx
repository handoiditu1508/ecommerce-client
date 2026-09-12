import PagedProductList from "@/modules/product/components/PagedProductList";
import { GetDiscountedProductsQuery } from "@/models/apis/product/getDiscountedProducts";
import { useCountDiscountedProductsQuery, useGetDiscountedProductsQuery } from "@/redux/apis/productApi";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 20;

function DiscountedProductsPage() {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")!) || 1;
  const countDiscountedProductsResult = useCountDiscountedProductsQuery();
  const getDiscountedProductsQuery = useMemo<GetDiscountedProductsQuery>(() => ({ page, pageSize: PAGE_SIZE }), [page]);
  const getDiscountedProductsResult = useGetDiscountedProductsQuery(getDiscountedProductsQuery);

  return (
    <PagedProductList
      products={getDiscountedProductsResult.data}
      loading={getDiscountedProductsResult.isLoading}
      count={countDiscountedProductsResult.data}
      page={page}
      pageSize={PAGE_SIZE}
    />
  );
}

export default DiscountedProductsPage;
