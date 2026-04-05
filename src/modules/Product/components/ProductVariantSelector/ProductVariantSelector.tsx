import { ProductVariant } from "@/models/entities/Product";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import ProductVariantChip from "./ProductVariantChip";

type ProductVariantSelectorProps = {
  variants: ProductVariant[];
};

function ProductVariantSelector({ variants }: ProductVariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>();

  return (
    <Stack direction="row" flexWrap="wrap" gap={1}>
      {variants.map((v) => <ProductVariantChip
        key={v.id}
        value={v}
        selected={selectedVariant === v}
        onSelected={() => setSelectedVariant(v)}
      />)}
    </Stack>
  );
}

export default ProductVariantSelector;
