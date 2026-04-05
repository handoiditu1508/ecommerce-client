import CONFIG from "@/configs";
import { ProductVariant } from "@/models/entities/Product";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { MouseEventHandler } from "react";

type ProductVariantChipProps = {
  value: ProductVariant;
  selected?: boolean;
  onSelected?: MouseEventHandler<HTMLDivElement>;
};

function ProductVariantChip({
  value,
  selected,
  onSelected,
}: ProductVariantChipProps) {
  return (
    <Chip
      label={value.name}
      avatar={
        value.color || value.thumbnailPath
          ? <Avatar
            style={{ backgroundColor: value.color }}
            alt={value.name}
            src={CONFIG.FILE_URL + value.thumbnailPath}
          >
            {" "}
          </Avatar>
          : undefined
      }
      clickable
      disabled={!value.quantity}
      variant={selected ? "filled" : "outlined"}
      color={selected ? "primary" : "default"}
      onClick={onSelected}
    />
  );
}

export default ProductVariantChip;
