import { ArrayItemType } from "@/common/type";
import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import { DynamicInputOption } from "@/components/DynamicForm/models";
import CONFIG from "@/configs";
import useAppDispatch from "@/hooks/useAppDispatch";
import { UpdateProductVariantRequest, UpdateProductVariantsCommand } from "@/models/apis/product/updateProductVariants";
import Product, { ProductVariant } from "@/models/entities/Product";
import {
  useUpdateProductVariantsMutation,
  useUpdateProductVariantThumbnailMutation,
} from "@/redux/apis/productApi";
import { pushNotification } from "@/redux/slices/notificationSlice";
import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import HideImageIcon from "@mui/icons-material/HideImage";
import RemoveIcon from "@mui/icons-material/Remove";
import UploadIcon from "@mui/icons-material/Upload";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Path, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NIL as NIL_UUID } from "uuid";
import QuantityChangeDialog, { QuantityChangeDialogState, QuantityChangeType } from "./QuantityChangeDialog";

// Select value that represents removing or not assigning a variant thumbnail.
const EMPTY_THUMBNAIL_ID = "empty";
// Select value that opens the hidden file picker.
const UPLOAD_NEW_ID = "upload-new";
// Select value used while a newly selected local image is being previewed.
const TEMPORARY_UPLOAD_ID = NIL_UUID;
// Give each unsaved variant a stable local identity; API requests convert negative IDs back to zero.
let nextTemporaryVariantId = -1;

type ProductVariantsFormModel = Omit<UpdateProductVariantsCommand, "productVariants"> & {
  productVariants: (UpdateProductVariantRequest & Pick<ProductVariant, "quantity" | "price" | "discountPrice">)[];
};

// React Hook Form addresses array fields by index even though thumbnail state is stored by variant ID.
type VariantThumbnailKey = `productVariants.${number}.thumbnailId`;

// Each dynamic thumbnail field can receive its own list of select options.
type VariantOptionsMap = Partial<{
  [K in Path<ProductVariantsFormModel>]: DynamicInputOption<ProductVariantsFormModel, K>[]
}>;

// The parent supplies the product whose variants and images are being edited.
type ProductVariantsFormProps = { product: Product; };

// Describe the dynamic array and its fields once, outside the component, to avoid rebuilding it per render.
const formModel: DynamicFormModel<ProductVariantsFormModel> = {
  inputs: [
    {
      name: "productVariants",
      inputType: "array",
      label: "admin-product:product_variants",
      addButtonText: "admin-product:add_variant",
      removeButtonText: "admin-product:remove_variant",
      itemInputs: [
        {
          name: "name",
          inputType: "text",
          label: "admin-product:variant_name",
          required: true,
          size: {
            sm: 6,
            md: 3,
          },
          rules: { required: "admin-product:this_field_is_required" },
        },
        {
          name: "sku",
          inputType: "text",
          label: "admin-product:sku",
          required: true,
          size: {
            sm: 6,
            md: 3,
          },
          rules: {
            required: "admin-product:this_field_is_required",
            validate: (value, model) => (
              model.productVariants.filter((variant) => variant.sku === value).length === 1
              || "admin-product:sku_must_be_unique"
            ),
          },
        },
        {
          name: "color",
          inputType: "color",
          label: "admin-product:variant_color",
          size: {
            sm: 6,
            md: 3,
          },
        },
        {
          name: "thumbnailId",
          inputType: "select",
          label: "admin-product:thumbnail",
          options: [],
          size: {
            sm: 6,
            md: 3,
          },
        },
        {
          name: "price",
          inputType: "currency",
          label: "admin-product:price",
          readOnly: true,
          size: {
            sm: 6,
            md: 3,
          },
        },
        {
          name: "discountPrice",
          inputType: "currency",
          label: "admin-product:discount_price",
          readOnly: true,
          size: {
            sm: 6,
            md: 3,
          },
        },
        {
          name: "quantity",
          inputType: "text",
          label: "admin-product:quantity",
          readOnly: true,
          size: {
            sm: 6,
            md: 3,
          },
        },
      ],
      // A negative ID uniquely identifies this row until the server creates the real variant.
      createDefaultValue: () => ({
        id: nextTemporaryVariantId--,
        sku: "",
        name: "",
        thumbnailId: EMPTY_THUMBNAIL_ID,
        quantity: 0,
      }),
    },
  ],
  submitButtonText: "admin-product:update_product_variants",
};

// Convert a stored thumbnail path into the image ID expected by the select and update API.
const getThumbnailId = (product: Product, thumbnailPath?: string): string =>
  product.images.find((image) => image.filePath === thumbnailPath)?.id ?? EMPTY_THUMBNAIL_ID;

function ProductVariantsForm({ product }: ProductVariantsFormProps) {
  // Dispatch global success notifications.
  const dispatch = useAppDispatch();
  // Read labels from the admin product namespace.
  const { t } = useTranslation("admin-product");
  // Update variant fields and add/delete rows in one request.
  const [updateVariants, updateVariantsResult] = useUpdateProductVariantsMutation();
  // Upload a new thumbnail or remove the current thumbnail in a separate request.
  const [updateThumbnail, updateThumbnailResult] = useUpdateProductVariantThumbnailMutation();
  const [quantityChangeDialog, setQuantityChangeDialog] = useState<QuantityChangeDialogState | null>(null);
  // Rebuild initial form values whenever RTK Query supplies a refreshed product.
  const values = useMemo<ProductVariantsFormModel>(() => ({
    id: product.id,
    productVariants: product.productVariants.map<ArrayItemType<ProductVariantsFormModel["productVariants"]>>((variant) => ({
      ...variant,
      // Resolve the thumbnail path to an image ID, or select the explicit empty option.
      thumbnailId: getThumbnailId(product, variant.thumbnailPath),
    })),
  }), [product]);
  // Let server refreshes reset the form through React Hook Form's reactive values option.
  const formContext = useForm<ProductVariantsFormModel>({ values });
  // Watch the array so thumbnail options and hidden file inputs follow dynamic add/remove operations.
  const variants = formContext.watch("productVariants");
  // React Hook Form can preserve the array reference when only a nested thumbnail selection changes.
  const thumbnailSelectionKey = JSON.stringify(
    variants.map(({ id, thumbnailId }) => [id, thumbnailId]),
  );
  // Disable the complete form while either stage of the save is running.
  const loading = updateVariantsResult.isLoading || updateThumbnailResult.isLoading;
  const openQuantityChangeDialog = useCallback((
    type: QuantityChangeType,
    data: ProductVariantsFormModel,
    index: number,
  ) => {
    const variant = data.productVariants[index];
    if (!variant || variant.id <= 0) return;

    setQuantityChangeDialog({ type, variant });
  }, []);

  // Store each hidden file input by stable variant ID so reordering rows does not mix them up.
  const fileInputMapRef = useRef<Record<number, HTMLInputElement | null>>({});
  // Store selected files outside the API form model because thumbnails use a separate endpoint.
  const thumbnailFileMapRef = useRef<Record<number, FileList | undefined>>({});
  // Remember the previous select value so canceling the native picker can restore it.
  const previousThumbnailIdMapRef = useRef<Record<number, string>>({});
  // Store browser object URLs by variant ID to display local image previews.
  const [temporaryThumbnailUrlMap, setTemporaryThumbnailUrlMap] = useState<Record<number, string>>({});

  // Register a row's hidden file input and its native file-picker cancellation listener.
  const setFileInputRef = useCallback((variantId: number, index: number, fileInput: HTMLInputElement | null) => {
    // Keep the DOM input addressable by variant identity.
    fileInputMapRef.current[variantId] = fileInput;

    // Restore the select when the user closes the picker without choosing a file.
    const handleFileSelectionCancel = () => {
      formContext.setValue(
        `productVariants.${index}.thumbnailId`,
        previousThumbnailIdMapRef.current[variantId] ?? EMPTY_THUMBNAIL_ID,
      );
    };
    // The native cancel event is not exposed as a React input prop, so attach it directly.
    fileInput?.addEventListener("cancel", handleFileSelectionCancel);

    // Remove the native listener and stale ref when React replaces or unmounts the input.
    return () => {
      fileInput?.removeEventListener("cancel", handleFileSelectionCancel);
      if (fileInputMapRef.current[variantId] === fileInput) fileInputMapRef.current[variantId] = null;
    };
  }, [formContext]);

  // React to thumbnail select changes made inside DynamicForm.
  useEffect(() => {
    variants.forEach((variant, index) => {
      // Choosing "upload new" delegates to the hidden file input for this variant.
      if (variant.thumbnailId === UPLOAD_NEW_ID) {
        fileInputMapRef.current[variant.id]?.click();
      } else if (variant.thumbnailId !== TEMPORARY_UPLOAD_ID) {
        // Choosing empty or an existing image discards any pending local upload.
        thumbnailFileMapRef.current[variant.id] = undefined;
        setTemporaryThumbnailUrlMap((current) => {
          // Preserve state identity when this variant has no preview to remove.
          if (!(variant.id in current)) return current;
          // Copy before deleting because React state must not be mutated directly.
          const next = { ...current };
          delete next[variant.id];

          return next;
        });
      }
      // Do not remember the upload action itself; cancellation must restore the selection before it.
      if (variant.thumbnailId !== UPLOAD_NEW_ID) {
        previousThumbnailIdMapRef.current[variant.id] = variant.thumbnailId ?? EMPTY_THUMBNAIL_ID;
      }
    });
  }, [thumbnailSelectionKey, variants]);

  // Release object URLs after replacement and when the component unmounts.
  useEffect(() => () => {
    Object.values(temporaryThumbnailUrlMap).forEach((url) => URL.revokeObjectURL(url));
  }, [temporaryThumbnailUrlMap]);

  // Build the options for every indexed thumbnail select rendered by the dynamic array.
  const productVariantOptionsMap = useMemo<VariantOptionsMap>(() => {
    // DynamicForm expects a map keyed by the complete React Hook Form field path.
    const result: VariantOptionsMap = {};

    // This option opens the native file picker through the effect above.
    const uploadThumbnailOption: DynamicInputOption<ProductVariantsFormModel, VariantThumbnailKey> = {
      key: UPLOAD_NEW_ID,
      label: "admin-product:upload_new_thumbnail",
      value: UPLOAD_NEW_ID,
      icon: <UploadIcon />,
    };

    // This option requests thumbnail removal for an existing variant.
    const emptyOption: DynamicInputOption<ProductVariantsFormModel, VariantThumbnailKey> = {
      key: EMPTY_THUMBNAIL_ID,
      label: "admin-product:empty_thumbnail",
      value: EMPTY_THUMBNAIL_ID,
      icon: <HideImageIcon />,
    };

    // Product images are reusable thumbnail choices for every variant row.
    const existingImageOptions = product.images.map<
      DynamicInputOption<ProductVariantsFormModel, VariantThumbnailKey>
    >((image) => ({
      key: image.id,
      label: image.name,
      value: image.id,
      avatar: <Avatar alt={image.name} src={CONFIG.FILE_URL + image.filePath} variant="rounded" />,
    }));

    variants.forEach((variant, index) => {
      // The form path uses the current index; preview/file state still uses the stable variant ID.
      const path: VariantThumbnailKey = `productVariants.${index}.thumbnailId`;
      result[path] = [
        uploadThumbnailOption,
        emptyOption,
        // Show the selected local file as an option only for the owning variant.
        ...(temporaryThumbnailUrlMap[variant.id]
          ? [{
            key: TEMPORARY_UPLOAD_ID,
            label: "admin-product:new_thumbnail",
            value: TEMPORARY_UPLOAD_ID,
            avatar: <Avatar src={temporaryThumbnailUrlMap[variant.id]} variant="rounded" />,
          }]
          : []),
        // Append all images already associated with the product.
        ...existingImageOptions,
      ];
    });

    return result;
  }, [product.images, temporaryThumbnailUrlMap, variants]);

  // Save array changes first, then apply file uploads/removals that require persisted variant IDs.
  const handleSubmit = async ({ productVariants }: ProductVariantsFormModel) => {
    try {
      // The first request creates, updates, and deletes variants and returns their persisted IDs.
      const updatedProduct = await updateVariants({
        id: product.id,
        productVariants: productVariants.map((variant) => ({
          ...variant,
          // Negative values are client-only IDs; zero tells the API to create a variant.
          id: variant.id > 0 ? variant.id : 0,
          // Empty and temporary values are UI sentinels rather than storage image IDs.
          thumbnailId: variant.thumbnailId === EMPTY_THUMBNAIL_ID
            || variant.thumbnailId === TEMPORARY_UPLOAD_ID
            ? undefined
            : variant.thumbnailId,
        })),
      }).unwrap();
      // Existing IDs let us identify which returned variants were newly created.
      const originalVariantIds = new Set(product.productVariants.map((variant) => variant.id));
      const createdVariants = updatedProduct.productVariants.filter((variant) => !originalVariantIds.has(variant.id));
      // Match new form rows to returned variants in request/response order.
      let createdVariantIndex = 0;

      // Thumbnail requests are independent, so run them concurrently after IDs are available.
      await Promise.all(productVariants.flatMap((variant) => {
        // Existing rows retain their ID; new rows take the next server-generated ID.
        const variantId = variant.id > 0 ? variant.id : createdVariants[createdVariantIndex++]?.id;
        // Skip defensively if the server did not return an ID for a new row.
        if (!variantId) return [];
        // Look up the pending file using the row's stable local identity.
        const thumbnailFile = thumbnailFileMapRef.current[variant.id];
        // Compare with initial product data to avoid unnecessary removal requests.
        const originalVariant = product.productVariants.find(({ id }) => id === variant.id);
        const removesThumbnail = variant.thumbnailId === EMPTY_THUMBNAIL_ID && originalVariant?.thumbnailPath;
        // Existing product-image choices were already handled by updateVariants.
        if (!thumbnailFile && !removesThumbnail) return [];

        // Omitting thumbnailFile tells the thumbnail endpoint to remove the thumbnail.
        return [updateThumbnail({
          id: variantId,
          productId: product.id,
          thumbnailFile,
        }).unwrap()];
      }));
      // Release successfully uploaded files and remove their temporary previews.
      thumbnailFileMapRef.current = {};
      setTemporaryThumbnailUrlMap({});
      // Notify only after both the variant and thumbnail stages finish successfully.
      dispatch(pushNotification({
        text: t("product_variants_updated_successfully"),
        severity: "success",
      }));
    } catch {}
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* Render one hidden native picker per dynamic row so every variant can select its own file. */}
      {variants.map((variant, index) => (
        <input
          key={variant.id}
          ref={(fileInput) => setFileInputRef(variant.id, index, fileInput)}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            // Ignore an empty change event; cancellation is handled by the native cancel listener.
            const file = event.currentTarget.files?.item(0);
            if (!file) return;
            // Recreate a FileList because the thumbnail mutation model accepts FileList rather than File.
            const fileContainer = new DataTransfer();
            fileContainer.items.add(file);
            // Save the file under the stable variant ID for the second submit stage.
            thumbnailFileMapRef.current[variant.id] = fileContainer.files;
            // Create a browser URL so DynamicForm can show the chosen image immediately.
            setTemporaryThumbnailUrlMap((current) => ({
              ...current,
              [variant.id]: URL.createObjectURL(file),
            }));
            // Select the temporary preview option and mark the field as user-modified.
            formContext.setValue(`productVariants.${index}.thumbnailId`, TEMPORARY_UPLOAD_ID, {
              shouldDirty: true,
            });
            // Clear the native input so choosing the same file again still triggers onChange.
            event.currentTarget.value = "";
          }}
        />
      ))}
      <QuantityChangeDialog
        productId={product.id}
        quantityChange={quantityChangeDialog}
        onClose={() => setQuantityChangeDialog(null)}
      />
      {/* DynamicForm owns array rendering, validation, add/remove controls, and submission. */}
      <DynamicForm
        formContext={formContext}
        model={formModel}
        loading={loading}
        optionsMap={productVariantOptionsMap}
        arrayItemActionsMap={{
          productVariants: [
            {
              key: "increase_quantity",
              label: "admin-product:increase_quantity",
              icon: <AddIcon />,
              disabled: (data, index) => data.productVariants[index].id <= 0,
              onClick: (data, index) => openQuantityChangeDialog("increase", data, index),
            },
            {
              key: "decrease_quantity",
              label: "admin-product:decrease_quantity",
              icon: <RemoveIcon />,
              disabled: (data, index) => data.productVariants[index].id <= 0,
              onClick: (data, index) => openQuantityChangeDialog("decrease", data, index),
            },
            {
              key: "move_up",
              label: "admin-product:move_up",
              icon: <ArrowUpwardIcon />,
              hidden: (data, index) => index === 0,
              onClick: (data, index) => {
                const current = formContext.getValues().productVariants;
                if (index <= 0) return;
                const next = [...current];
                const tmp = next[index - 1];
                next[index - 1] = next[index];
                next[index] = tmp;
                formContext.setValue("productVariants", next, { shouldDirty: true });
              },
            },
            {
              key: "move_down",
              label: "admin-product:move_down",
              icon: <ArrowDownwardIcon />,
              hidden: (data, index) => index === data.productVariants.length - 1,
              onClick: (data, index) => {
                const current = formContext.getValues().productVariants;
                if (index >= current.length - 1) return;
                const next = [...current];
                const tmp = next[index + 1];
                next[index + 1] = next[index];
                next[index] = tmp;
                formContext.setValue("productVariants", next, { shouldDirty: true });
              },
            },
          ],
        }}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}

export default ProductVariantsForm;
