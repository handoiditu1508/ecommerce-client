import CascadingCategorySelect from "@/components/CascadingCategorySelect";
import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import { DynamicInputOption } from "@/components/DynamicForm/models";
import CONFIG from "@/configs";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import { UpdateProductCommand } from "@/models/apis/product/updateProduct";
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
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { NIL as NIL_UUID } from "uuid";
import ProductReadonlyDetails from "./ProductReadonlyDetails";

const UPLOAD_NEW_ID = "upload-new";
const TEMPORARY_UPLOAD_ID = NIL_UUID;

const formModel: DynamicFormModel<UpdateProductCommand> = {
  inputs: [
    {
      name: "name",
      inputType: "text",
      label: "product:product_name",
      required: true,
      rules: { required: "product:this_field_is_required" },
    },
    {
      name: "price",
      inputType: "currency",
      label: "product:price",
      required: true,
      rules: {
        required: "product:this_field_is_required",
        min: { value: 0, message: "product:price_must_not_be_negative" },
      },
    },
    { name: "categoryId", inputType: "text", label: "product:category" },
    { name: "thumbnailId", inputType: "select", label: "product:thumbnail", options: [] },
    // { name: "thumbnailId", inputType: "text", label: "product:thumbnail" },
    // {
    //   name: "thumbnailFile",
    //   inputType: "file",
    //   label: "product:upload_new_thumbnail",
    //   accept: "image/*",
    //   hidden: (data) => !!data.thumbnailId,
    //   rules: {
    //     validate: (files, data) => (
    //       !!data.thumbnailId || !!files?.length || "product:this_field_is_required"
    //     ),
    //   },
    // },
  ],
  submitButtonText: "product:update_product",
};

const getThumbnailId = (product: Product): string | undefined =>
  product.images.find((image) => image.filePath === product.thumbnailPath)?.id;

function UpdateProductPage() {
  const id = Number(useParams().id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("product");
  useGetCategoryTreesQuery();
  const categories = useAppSelector(categorySelectors.tree);
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
              label: "product:upload_new_thumbnail",
              value: UPLOAD_NEW_ID,
              icon: <UploadIcon />,
            },
            ...(temporaryThumbnailUrl
              ? [{
                key: TEMPORARY_UPLOAD_ID,
                label: "product:new_thumbnail",
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
        }}
        renderInputMap={{
          categoryId: (
            <Controller
              control={formContext.control}
              name="categoryId"
              render={({ field, fieldState }) => (
                <CascadingCategorySelect
                  categories={categories}
                  value={field.value}
                  label={t("category_optional")}
                  disabled={updateResult.isLoading}
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                />
              )}
            />
          ),
          // thumbnailId: (
          //   <Controller
          //     control={formContext.control}
          //     name="thumbnailId"
          //     render={({ field }) => (
          //       <FormControl fullWidth margin="normal">
          //         <InputLabel>{t("thumbnail")}</InputLabel>
          //         <Select
          //           {...field}
          //           label={t("thumbnail")}
          //           disabled={updateResult.isLoading}
          //           renderValue={(thumbnailId) => {
          //             const image = product.images.find(({ id: imageId }) => imageId === thumbnailId);

          //             return image
          //               ? (
          //                 <Stack direction="row" spacing={1} alignItems="center">
          //                   <Box
          //                     component="img"
          //                     src={CONFIG.FILE_URL + image.filePath}
          //                     alt=""
          //                     sx={{ width: 32, height: 32, objectFit: "contain" }}
          //                   />
          //                   <Typography noWrap>{image.name}</Typography>
          //                 </Stack>
          //               )
          //               : (
          //                 <Stack direction="row" spacing={1} alignItems="center">
          //                   <UploadFileIcon fontSize="small" />
          //                   <Typography>{t("upload_new_thumbnail")}</Typography>
          //                 </Stack>
          //               );
          //           }}
          //           onChange={(event) => {
          //             field.onChange(event);
          //             if (event.target.value) {
          //               formContext.setValue("thumbnailFile", undefined);
          //             }
          //           }}
          //         >
          //           <MenuItem value="">
          //             <Stack direction="row" spacing={1} alignItems="center">
          //               <UploadFileIcon fontSize="small" />
          //               <Typography>{t("upload_new_thumbnail")}</Typography>
          //             </Stack>
          //           </MenuItem>
          //           {product.images.map((image) => (
          //             <MenuItem key={image.id} value={image.id}>
          //               <Stack direction="row" spacing={1} alignItems="center">
          //                 <Box
          //                   component="img"
          //                   src={CONFIG.FILE_URL + image.filePath}
          //                   alt=""
          //                   sx={{ width: 40, height: 40, objectFit: "contain" }}
          //                 />
          //                 <Typography>{image.name}</Typography>
          //               </Stack>
          //             </MenuItem>
          //           ))}
          //         </Select>
          //       </FormControl>
          //     )}
          //   />
          // ),
        }}
        onSubmit={handleSubmit}
      />
      <ProductReadonlyDetails product={product} />
    </Paper>
  );
}

export default UpdateProductPage;
