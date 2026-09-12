import PagedProductList from "@/modules/product/components/PagedProductList";
import { GetLatestProductsQuery } from "@/models/apis/product/getLatestProducts";
import { useCountAllProductsQuery, useGetLatestProductsQuery } from "@/redux/apis/productApi";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 20;

function LatestProductsPage() {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")!) || 1;
  const countAllProductsResult = useCountAllProductsQuery();
  const getLatestProductsQuery = useMemo<GetLatestProductsQuery>(() => ({ page, pageSize: PAGE_SIZE }), [page]);
  const getLatestProductsResult = useGetLatestProductsQuery(getLatestProductsQuery);

  return (
    <PagedProductList
      products={getLatestProductsResult.data}
      loading={getLatestProductsResult.isLoading}
      count={countAllProductsResult.data}
      page={page}
      pageSize={PAGE_SIZE}
    />
  );
}

export default LatestProductsPage;
