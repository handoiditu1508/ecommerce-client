import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { useState } from "react";
import { ProductAttributeValue } from "./ProductAttribute";

type ProductAttibuteValueChipProps = {
  value: ProductAttributeValue;
};

function ProductAttibuteValueChip({ value }: ProductAttibuteValueChipProps) {
  const [selected, setSelected] = useState<boolean>(false);

  const handleClick = () => {
    setSelected(!selected);
  };

  return (
    <Chip
      label={value.value}
      avatar={
        value.color || value.imageUrl
          ? <Avatar
            style={{ backgroundColor: value.color }}
            {...(value.imageUrl && { alt: "product attribute", src: value.imageUrl })}
          >
            {" "}
          </Avatar>
          : undefined
      }
      clickable
      variant={selected ? "filled" : "outlined"}
      color={selected ? "primary" : "default"}
      onClick={handleClick}
    />
  );
}

export default ProductAttibuteValueChip;
