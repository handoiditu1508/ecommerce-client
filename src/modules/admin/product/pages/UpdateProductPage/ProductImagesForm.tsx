import FileInput from "@/components/FileInput";
import CONFIG from "@/configs";
import { BreakpointsContext } from "@/contexts/breakpoints";
import useAppDispatch from "@/hooks/useAppDispatch";
import Product from "@/models/entities/Product";
import { SimpleFileView } from "@/models/entities/StorageItem";
import {
  useDeleteProductImagesMutation,
  useReorderProductImagesMutation,
  useUploadProductImagesMutation,
} from "@/redux/apis/productApi";
import { pushNotification } from "@/redux/slices/notificationSlice";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import ProductImagePreviewDialog from "./ProductImagePreviewDialog";

// The parent supplies the product whose image gallery is being managed.
type ProductImagesFormProps = { product: Product; };

function ProductImagesForm({ product }: ProductImagesFormProps) {
  // Dispatch global success notifications; failures are reported by the RTK Query error middleware.
  const dispatch = useAppDispatch();
  // Read labels from the admin product namespace.
  const { t } = useTranslation("admin-product");
  // Widen the gallery once the section switches to its two-column layout.
  const { mdAndUp } = useContext(BreakpointsContext);
  const [uploadImages, uploadResult] = useUploadProductImagesMutation();
  const [deleteImages, deleteResult] = useDeleteProductImagesMutation();
  const [reorderImages, reorderResult] = useReorderProductImagesMutation();
  // Drive FileInput as a controlled input so the dropzone clears itself once the upload settles.
  const [selectedFiles, setSelectedFiles] = useState<File[]>(CONFIG.EMPTY_ARRAY);
  // The image currently shown in the zoomable preview dialog; `null` keeps it closed.
  const [previewImage, setPreviewImage] = useState<SimpleFileView | null>(null);
  // Every action writes to the same product, so block the whole section while one is in flight.
  const loading = uploadResult.isLoading || deleteResult.isLoading || reorderResult.isLoading;

  // Send the chosen files immediately; there is no submit button for this section.
  const handleFilesChange = async (files: File[]) => {
    if (!files.length) {
      setSelectedFiles(CONFIG.EMPTY_ARRAY);

      return;
    }

    // Show the selection while the request runs.
    setSelectedFiles(files);
    // The upload command accepts a FileList, which only DataTransfer can build from File objects.
    const fileContainer = new DataTransfer();
    files.forEach((file) => fileContainer.items.add(file));

    try {
      await uploadImages({
        productId: product.id,
        images: fileContainer.files,
      }).unwrap();
      dispatch(pushNotification({
        text: t("product_images_uploaded_successfully"),
        severity: "success",
      }));
    } catch {}
    // Reset the dropzone whether the upload succeeded or failed so the next attempt starts clean.
    setSelectedFiles(CONFIG.EMPTY_ARRAY);
  };

  // Delete a single image right away; the mutation refreshes the cached product.
  const handleDelete = async (imageId: string) => {
    try {
      await deleteImages({
        productId: product.id,
        imageIds: [imageId],
      }).unwrap();
      dispatch(pushNotification({
        text: t("product_image_deleted_successfully"),
        severity: "success",
      }));
    } catch {}
  };

  // Swap an image with its neighbour and persist the resulting order.
  const handleMove = async (index: number, offset: number) => {
    const targetIndex = index + offset;
    if (targetIndex < 0 || targetIndex >= product.images.length) return;

    // The reorder command expects the complete list of image IDs in their new order.
    const imageIds = product.images.map((image) => image.id);
    const movedImageId = imageIds[index];
    imageIds[index] = imageIds[targetIndex];
    imageIds[targetIndex] = movedImageId;

    try {
      await reorderImages({
        productId: product.id,
        imageIds,
      }).unwrap();
      dispatch(pushNotification({
        text: t("product_images_reordered_successfully"),
        severity: "success",
      }));
    } catch {}
  };

  return (
    <>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>{t("product_images")}</Typography>
      <Grid container spacing={2}>
        {/* Uploading column: full width below md, then the narrower half of the section. */}
        <Grid size={{ xs: 12, md: 4 }}>
          <FileInput
            files={selectedFiles}
            readonly={loading}
            sx={{ width: "100%" }}
            dropzonePlaceholder={t("drop_images_here_or_click_to_upload")}
            inputPlaceholder={t("paste_image_or_image_url")}
            inputProps={{
              multiple: true,
              accept: "image/*",
            }}
            onFilesChange={handleFilesChange}
          />
        </Grid>
        {/* Gallery column: stacks under the dropzone below md, sits beside it from md up. */}
        <Grid size={{ xs: 12, md: 8 }}>
          {product.images.length === 0
            ? <Typography variant="body2" color="text.secondary">{t("no_product_images")}</Typography>
            : (
              <ImageList cols={mdAndUp ? 3 : 2} gap={8} rowHeight={180} sx={{ m: 0 }}>
                {product.images.map((image, index) => (
                  <ImageListItem key={image.id}>
                    <ButtonBase
                      sx={{ height: "100%", width: "100%" }}
                      onClick={() => setPreviewImage(image)}>
                      <Box
                        component="img"
                        src={CONFIG.FILE_URL + image.filePath}
                        alt={image.name}
                        loading="lazy"
                        sx={{ height: "100%", width: "100%", objectFit: "cover" }}
                      />
                    </ButtonBase>
                    {/* Order and delete actions live in the top bar so the file name keeps the bottom row. */}
                    <ImageListItemBar
                      position="top"
                      actionPosition="left"
                      actionIcon={(
                        <Stack direction="row" sx={{ color: "common.white" }}>
                          <Tooltip title={t("move_up")}>
                            <span>
                              <IconButton
                                size="small"
                                color="inherit"
                                disabled={loading || index === 0}
                                onClick={() => handleMove(index, -1)}>
                                <ArrowUpwardIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title={t("move_down")}>
                            <span>
                              <IconButton
                                size="small"
                                color="inherit"
                                disabled={loading || index === product.images.length - 1}
                                onClick={() => handleMove(index, 1)}>
                                <ArrowDownwardIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title={t("delete_image")}>
                            <span>
                              <IconButton
                                size="small"
                                color="inherit"
                                disabled={loading}
                                onClick={() => handleDelete(image.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Stack>
                      )}
                    />
                    <ImageListItemBar title={image.name} subtitle={`#${index + 1}`} />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
        </Grid>
      </Grid>
      <ProductImagePreviewDialog image={previewImage} onClose={() => setPreviewImage(null)} />
    </>
  );
}

export default ProductImagesForm;
