import PagedProductList from "@/modules/product/components/PagedProductList";
import { CountProductsByPromotionQuery, GetProductsByPromotionQuery } from "@/models/apis/product/getProductsByPromotion";
import { useCountProductsByPromotionQuery, useGetProductsByPromotionQuery } from "@/redux/apis/productApi";
import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const PAGE_SIZE = 20;

function PromotionProductsPage() {
  const { promotionId } = useParams<{ promotionId: string; }>();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")!) || 1;
  const parsedPromotionId = Number(promotionId);
  const skip = !Number.isInteger(parsedPromotionId);
  const getProductsByPromotionQuery = useMemo<GetProductsByPromotionQuery>(
    () => ({ promotionId: parsedPromotionId, page, pageSize: PAGE_SIZE }),
    [parsedPromotionId, page],
  );
  const countProductsByPromotionQuery = useMemo<CountProductsByPromotionQuery>(
    () => ({ promotionId: parsedPromotionId }),
    [parsedPromotionId],
  );
  const getProductsByPromotionResult = useGetProductsByPromotionQuery(getProductsByPromotionQuery, { skip });
  const countProductsByPromotionResult = useCountProductsByPromotionQuery(countProductsByPromotionQuery, { skip });

  return (
    <PagedProductList
      products={getProductsByPromotionResult.data}
      loading={getProductsByPromotionResult.isLoading}
      count={countProductsByPromotionResult.data}
      page={page}
      pageSize={PAGE_SIZE}
    />
  );
}

export default PromotionProductsPage;
