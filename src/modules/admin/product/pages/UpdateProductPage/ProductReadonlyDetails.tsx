import { DynamicFormModel, DynamicGridForm } from "@/components/DynamicForm";
import useAppSelector from "@/hooks/useAppSelector";
import Product from "@/models/entities/Product";
import { useGetAllBrandsQuery } from "@/redux/apis/brandApi";
import { brandSelectors } from "@/redux/slices/brandSlice";
import PercentIcon from "@mui/icons-material/Percent";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type ProductReadonlyDetailsProps = {
  product: Product;
};

type ProductDetailsForm = {
  discountPrice: number;
  discountPercentage: number;
  thumbnailPath: string;
  brandName?: string;
  description?: string;
  createdDate: string;
  modifiedDate: string;
  createdBy?: string;
  modifiedBy?: string;
  isDeleted: boolean;
  deletedDate?: string;
};

const formModel: DynamicFormModel<ProductDetailsForm> = {
  inputs: [
    {
      name: "discountPrice",
      inputType: "currency",
      label: "admin-product:discount_price",
      readOnly: true,
      size: { sm: 6 },
    },
    {
      name: "discountPercentage",
      inputType: "text",
      label: "admin-product:discount_percentage",
      readOnly: true,
      size: { sm: 6 },
    },
    { name: "thumbnailPath", inputType: "text", label: "admin-product:thumbnail_path", readOnly: true, size: { sm: 6 } },
    { name: "brandName", inputType: "text", label: "admin-product:brand", readOnly: true, size: { sm: 6 } },
    { name: "description", inputType: "text", label: "admin-product:description", readOnly: true, size: { sm: 6 } },
    { name: "createdDate", inputType: "datetime", label: "admin-product:created_date", readOnly: true, size: { sm: 6 } },
    { name: "modifiedDate", inputType: "datetime", label: "admin-product:modified_date", readOnly: true, size: { sm: 6 } },
    { name: "createdBy", inputType: "text", label: "admin-product:created_by", readOnly: true, size: { sm: 6 } },
    { name: "modifiedBy", inputType: "text", label: "admin-product:modified_by", readOnly: true, size: { sm: 6 } },
    { name: "isDeleted", inputType: "checkbox", label: "admin-product:deleted", readOnly: true, size: { sm: 6 } },
    { name: "deletedDate", inputType: "datetime", label: "admin-product:deleted_date", readOnly: true, size: { sm: 6 } },
  ],
};

function ProductReadonlyDetails({ product }: ProductReadonlyDetailsProps) {
  const { t } = useTranslation("admin-product");
  useGetAllBrandsQuery();
  const brand = useAppSelector(brandSelectors.byId(product.brandId ?? 0));
  const formValues = useMemo<ProductDetailsForm>(() => ({
    discountPrice: product.discountPrice,
    discountPercentage: product.discountPercentage,
    thumbnailPath: product.thumbnailPath,
    brandName: brand?.name,
    description: product.description,
    createdDate: product.createdDate,
    modifiedDate: product.modifiedDate,
    createdBy: product.createdBy,
    modifiedBy: product.modifiedBy,
    isDeleted: product.isDeleted,
    deletedDate: product.deletedDate,
  }), [brand?.name, product]);
  const formContext = useForm<ProductDetailsForm>({ values: formValues });

  return (
    <>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>{t("product_details_readonly")}</Typography>
      <DynamicGridForm
        formContext={formContext}
        model={formModel}
        endAdornmentMap={{ discountPercentage: <PercentIcon fontSize="small" /> }}
        gridProps={{ spacing: 2 }}
        onSubmit={() => undefined}
      />

      <Typography variant="subtitle1" sx={{ mt: 3 }}>{t("images")}</Typography>
      <List dense disablePadding>
        {product.images.length === 0 && <ListItem>{t("none")}</ListItem>}
        {product.images.map((image) => (
          <ListItem key={image.id} disableGutters>
            <ListItemText primary={image.name} secondary={image.filePath} />
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default ProductReadonlyDetails;
