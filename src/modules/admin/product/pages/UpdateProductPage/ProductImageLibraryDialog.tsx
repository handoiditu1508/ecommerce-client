import { ImagePickerRenderProps } from "@/components/RichTextEditor";
import CONFIG from "@/configs";
import { SimpleFileView } from "@/models/entities/StorageItem";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

// Feeds RichTextEditor's `renderImagePicker` slot (see ProductImageLibraryDialog's usage in
// UpdateProductPage) - the editor itself stays product-agnostic and only knows the
// open/onClose/onSelect contract; this component supplies the actual product-specific source.
type ProductImageLibraryDialogProps = ImagePickerRenderProps & {
  images: SimpleFileView[];
};

function ProductImageLibraryDialog({ images, open, onClose, onSelect }: ProductImageLibraryDialogProps) {
  const { t } = useTranslation("admin-product");

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={onClose}>
      <DialogTitle>{t("select_product_image")}</DialogTitle>
      <DialogContent>
        {images.length === 0
          ? <Typography variant="body2" color="text.secondary">{t("no_product_images")}</Typography>
          : (
            <ImageList cols={3} gap={8} rowHeight={140}>
              {images.map((image) => (
                <ImageListItem key={image.id}>
                  <ButtonBase
                    sx={{ height: "100%", width: "100%" }}
                    onClick={() => onSelect({ src: image.filePath, altText: image.name })}
                  >
                    <Box
                      component="img"
                      src={CONFIG.FILE_URL + image.filePath}
                      alt={image.name}
                      loading="lazy"
                      sx={{ height: "100%", width: "100%", objectFit: "cover" }}
                    />
                  </ButtonBase>
                  <ImageListItemBar title={image.name} />
                </ImageListItem>
              ))}
            </ImageList>
          )}
      </DialogContent>
    </Dialog>
  );
}

export default ProductImageLibraryDialog;
