import { DynamicFormModel, DynamicGridForm } from "@/components/DynamicForm";
import useAppSelector from "@/hooks/useAppSelector";
import Product from "@/models/entities/Product";
import { useGetAllBrandsQuery } from "@/redux/apis/brandApi";
import { brandSelectors } from "@/redux/slices/brandSlice";
import PercentIcon from "@mui/icons-material/Percent";
import Divider from "@mui/material/Divider";
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
  createdDate: string;
  createdBy?: string;
  modifiedDate: string;
  modifiedBy?: string;
  isDeleted: boolean;
  deletedDate?: string;
  brandName?: string;
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
    { name: "createdDate", inputType: "datetime", label: "admin-product:created_date", readOnly: true, size: { sm: 6 } },
    { name: "createdBy", inputType: "text", label: "admin-product:created_by", readOnly: true, size: { sm: 6 } },
    { name: "modifiedDate", inputType: "datetime", label: "admin-product:modified_date", readOnly: true, size: { sm: 6 } },
    { name: "modifiedBy", inputType: "text", label: "admin-product:modified_by", readOnly: true, size: { sm: 6 } },
    { name: "isDeleted", inputType: "checkbox", label: "admin-product:deleted", readOnly: true, size: { sm: 6 } },
    { name: "deletedDate", inputType: "datetime", label: "admin-product:deleted_date", readOnly: true, size: { sm: 6 } },
    { name: "brandName", inputType: "text", label: "admin-product:brand", readOnly: true, size: { sm: 6 } },
  ],
};

function ProductReadonlyDetails({ product }: ProductReadonlyDetailsProps) {
  const { t } = useTranslation("admin-product");
  useGetAllBrandsQuery();
  const brand = useAppSelector(brandSelectors.byId(product.brandId ?? 0));
  const formValues = useMemo<ProductDetailsForm>(() => ({
    discountPrice: product.discountPrice,
    discountPercentage: product.discountPercentage,
    createdDate: product.createdDate,
    createdBy: product.createdBy,
    modifiedDate: product.modifiedDate,
    modifiedBy: product.modifiedBy,
    isDeleted: product.isDeleted,
    deletedDate: product.deletedDate,
    brandName: brand?.name,
  }), [brand?.name, product]);
  const formContext = useForm<ProductDetailsForm>({ values: formValues });

  return (
    <>
      <Divider sx={{ mt: 3, mb: 1 }} textAlign="left"><Typography variant="h6" gutterBottom>{t("product_details_readonly")}</Typography></Divider>
      <DynamicGridForm
        formContext={formContext}
        model={formModel}
        endAdornmentMap={{ discountPercentage: <PercentIcon fontSize="small" /> }}
        gridProps={{ spacing: 2 }}
        onSubmit={() => undefined}
      />
    </>
  );
}

export default ProductReadonlyDetails;
