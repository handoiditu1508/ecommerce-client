import CONFIG from "@/configs";
import { ProductVariant } from "@/models/entities/Product";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import ProductVariantChip from "./ProductVariantChip";

type ProductVariantSelectorProps = {
  variants?: ProductVariant[];
};

function ProductVariantSelector({ variants = CONFIG.EMPTY_ARRAY }: ProductVariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>();

  return (
    <Stack direction="row" flexWrap="wrap" gap={1}>
      {variants.length
        ? variants.map((v) => <ProductVariantChip
          key={v.id}
          value={v}
          selected={selectedVariant === v}
          onSelected={() => setSelectedVariant(v)}
        />)
        : [...Array(5)].map((_, i) => <Skeleton
          key={i}
          variant="rounded"
          width={100}
          height={32}
        />)}
    </Stack>
  );
}

export default ProductVariantSelector;
