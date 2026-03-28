import { ProductVariant } from "@/models/entities/Product";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { useState } from "react";

type ProductVariantChipProps = {
  value: ProductVariant;
};

function ProductVariantChip({ value }: ProductVariantChipProps) {
  const [selected, setSelected] = useState<boolean>(false);

  const handleClick = () => {
    setSelected(!selected);
  };

  return (
    <Chip
      label={value.name}
      avatar={
        value.color || value.thumbnailPath
          ? <Avatar
            style={{ backgroundColor: value.color }}
            {...(value.thumbnailPath && { alt: value.name, src: value.thumbnailPath })}
          >
            {" "}
          </Avatar>
          : undefined
      }
      clickable
      disabled={!value.quantity}
      variant={selected ? "filled" : "outlined"}
      color={selected ? "primary" : "default"}
      onClick={handleClick}
    />
  );
}

export default ProductVariantChip;
