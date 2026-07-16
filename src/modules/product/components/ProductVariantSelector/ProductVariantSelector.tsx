import CONFIG from "@/configs";
import { ProductVariant } from "@/models/entities/Product";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { Dispatch, useState } from "react";
import ProductVariantChip from "./ProductVariantChip";

type ProductVariantSelectorProps = {
  variants?: ProductVariant[];
  defaultVariantId?: number;
  onChange?: Dispatch<number>;
};

function ProductVariantSelector({
  variants = CONFIG.EMPTY_ARRAY,
  defaultVariantId,
  onChange = CONFIG.EMPTY_FUNCTION,
}: ProductVariantSelectorProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<number | undefined>(defaultVariantId);

  const handleSelectVariant = (variantId: number) => {
    setSelectedVariantId(variantId);
    onChange(variantId);
  };

  return (
    <Stack direction="row" flexWrap="wrap" gap={1}>
      {variants.length
        ? variants.map((v) => <ProductVariantChip
          key={v.id}
          value={v}
          selected={selectedVariantId === v.id}
          onSelected={() => handleSelectVariant(v.id)}
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
