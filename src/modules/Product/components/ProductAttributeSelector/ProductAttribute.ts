type ProductAttribute = {
  name: string;
  values: ProductAttributeValue[];
};

export type ProductAttributeValue = {
  value: string;
  color?: string;
  imageUrl?: string;
};

export default ProductAttribute;
