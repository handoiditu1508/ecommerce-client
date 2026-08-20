import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import { DynamicInputOption } from "@/components/DynamicForm/models";
import CONFIG from "@/configs";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import { UpdateProductCommand } from "@/models/apis/product/updateProduct";
import { categoriesToDynamicInputOptions } from "@/models/entities/Category";
import Product from "@/models/entities/Product";
import { useGetCategoryTreesQuery } from "@/redux/apis/categoryApi";
import { useGetProductQuery, useUpdateProductMutation } from "@/redux/apis/productApi";
import { categorySelectors } from "@/redux/slices/categorySlice";
import { pushNotification } from "@/redux/slices/notificationSlice";
import UploadIcon from "@mui/icons-material/Upload";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { NIL as NIL_UUID } from "uuid";
import ProductReadonlyDetails from "./ProductReadonlyDetails";
import ProductVariantsForm from "./ProductVariantsForm";

const UPLOAD_NEW_ID = "upload-new";
const TEMPORARY_UPLOAD_ID = NIL_UUID;

const formModel: DynamicFormModel<UpdateProductCommand> = {
  inputs: [
    {
      name: "name",
      inputType: "text",
      label: "admin-product:product_name",
      required: true,
      rules: { required: "admin-product:this_field_is_required" },
    },
    {
      name: "price",
      inputType: "currency",
      label: "admin-product:price",
      required: true,
      rules: {
        required: "admin-product:this_field_is_required",
        min: { value: 0, message: "admin-product:price_must_not_be_negative" },
      },
    },
    { name: "categoryId", inputType: "cascadingselect", label: "admin-product:category", options: [] },
    { name: "thumbnailId", inputType: "select", label: "admin-product:thumbnail", options: [] },
  ],
  submitButtonText: "admin-product:update_product",
};

const getThumbnailId = (product: Product): string | undefined =>
  product.images.find((image) => image.filePath === product.thumbnailPath)?.id;

function UpdateProductPage() {
  const id = Number(useParams().id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("admin-product");
  useGetCategoryTreesQuery();
  const categories = useAppSelector(categorySelectors.tree);
  const categoryOptions = useMemo<DynamicInputOption<UpdateProductCommand, "categoryId">[]>(
    () => categoriesToDynamicInputOptions<UpdateProductCommand, "categoryId">(categories),
    [categories]
  );
  const productResult = useGetProductQuery(
    { productId: id },
    { skip: !Number.isInteger(id) },
  );
  const [updateProduct, updateResult] = useUpdateProductMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousThumbnailIdRef = useRef<string | undefined>(undefined);
  const [temporaryThumbnailUrl, setTemporaryThumbnailUrl] = useState<string>();
  const formValues = useMemo<UpdateProductCommand | undefined>(() => (
    productResult.data
      ? {
        id: productResult.data.id,
        name: productResult.data.name,
        price: productResult.data.price,
        categoryId: productResult.data.categoryId,
        thumbnailId: getThumbnailId(productResult.data) ?? UPLOAD_NEW_ID,
        thumbnailFile: undefined,
      }
      : undefined
  ), [productResult.data]);
  const formContext = useForm<UpdateProductCommand>({ values: formValues });
  const product = productResult.data;
  const thumbnailId = formContext.watch("thumbnailId");

  const setFileInputRef = useCallback((fileInput: HTMLInputElement | null) => {
    fileInputRef.current = fileInput;

    const handleFileSelectionCancel = () => {
      formContext.setValue("thumbnailId", previousThumbnailIdRef.current ?? UPLOAD_NEW_ID);
    };
    fileInput?.addEventListener("cancel", handleFileSelectionCancel);

    return () => {
      fileInput?.removeEventListener("cancel", handleFileSelectionCancel);
      if (fileInputRef.current === fileInput) fileInputRef.current = null;
    };
  }, [formContext]);

  // Open the file picker for upload mode and discard temporary uploads when an existing image is selected.
  useEffect(() => {
    if (thumbnailId === UPLOAD_NEW_ID && previousThumbnailIdRef.current !== undefined) {
      fileInputRef.current?.click();
    } else if (thumbnailId !== TEMPORARY_UPLOAD_ID) {
      formContext.setValue("thumbnailFile", undefined);
      setTemporaryThumbnailUrl(undefined);
    }
    if (thumbnailId !== UPLOAD_NEW_ID) {
      previousThumbnailIdRef.current = thumbnailId;
    }
  }, [formContext, thumbnailId]);

  // Release temporary preview object URLs when they are replaced or the page unmounts.
  useEffect(() => () => {
    if (temporaryThumbnailUrl) URL.revokeObjectURL(temporaryThumbnailUrl);
  }, [temporaryThumbnailUrl]);

  if (!Number.isInteger(id)) {
    return <Alert severity="error">{t("invalid_product_id")}</Alert>;
  }
  if (productResult.isLoading) return <CircularProgress />;
  if (!product) {
    return <Alert severity="error">{t("unable_to_load_product")}</Alert>;
  }

  const handleSubmit = async (data: UpdateProductCommand) => {
    try {
      await updateProduct(data).unwrap();
      dispatch(pushNotification({
        text: t("product_updated_successfully"),
        severity: "success",
      }));
      navigate("/admin/products");
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{t("update_product")}</Typography>
      <input
        ref={setFileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const files = event.currentTarget.files;
          const file = files?.item(0);

          if (!files?.length || !file) {
            formContext.setValue("thumbnailId", previousThumbnailIdRef.current ?? UPLOAD_NEW_ID);

            return;
          }

          const fileContainer = new DataTransfer();
          fileContainer.items.add(file);
          setTemporaryThumbnailUrl(URL.createObjectURL(file));
          formContext.setValue("thumbnailFile", fileContainer.files, { shouldDirty: true });
          formContext.setValue("thumbnailId", TEMPORARY_UPLOAD_ID, { shouldDirty: true });
          event.currentTarget.value = "";
        }}
      />
      <DynamicForm
        formContext={formContext}
        model={formModel}
        loading={updateResult.isLoading}
        optionsMap={{
          thumbnailId: [
            {
              key: UPLOAD_NEW_ID,
              label: "admin-product:upload_new_thumbnail",
              value: UPLOAD_NEW_ID,
              icon: <UploadIcon />,
            },
            ...(temporaryThumbnailUrl
              ? [{
                key: TEMPORARY_UPLOAD_ID,
                label: "admin-product:new_thumbnail",
                value: TEMPORARY_UPLOAD_ID,
                avatar: <Avatar src={temporaryThumbnailUrl} variant="rounded" />,
              }]
              : []),
            ...product.images.map<DynamicInputOption<UpdateProductCommand, "thumbnailId">>((image) => ({
              key: image.id,
              label: image.name,
              value: image.id,
              avatar: <Avatar alt={image.name} src={CONFIG.FILE_URL + image.filePath} variant="rounded" />,
            })),
          ],
          categoryId: categoryOptions,
        }}
        onSubmit={handleSubmit}
      />
      <ProductVariantsForm product={product} />
      <ProductReadonlyDetails product={product} />
    </Paper>
  );
}

export default UpdateProductPage;
