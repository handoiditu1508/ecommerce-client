import { ProductVariant } from "@/models/entities/Product";
import Stack from "@mui/material/Stack";
import ProductVariantChip from "./ProductVariantChip";

type ProductVariantSelectorProps = {
  variants: ProductVariant[];
};

function ProductVariantSelector({ variants }: ProductVariantSelectorProps) {
  return (
    <Stack direction="row" flexWrap="wrap" gap={1}>
      {variants.map((v) => <ProductVariantChip key={v.id} value={v} />)}
    </Stack>
  );
}

export default ProductVariantSelector;
