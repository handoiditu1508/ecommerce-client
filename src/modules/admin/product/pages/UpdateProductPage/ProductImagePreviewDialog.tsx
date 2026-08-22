import CONFIG from "@/configs";
import { BreakpointsContext } from "@/contexts/breakpoints";
import { SimpleFileView } from "@/models/entities/StorageItem";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import "swiper/css";
import "swiper/css/zoom";
import { Zoom } from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

// Shared style for the overlay controls floating above the zoomable image.
const overlayButtonSx = {
  color: "common.white",
  bgcolor: "rgba(0, 0, 0, 0.4)",
  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.6)" },
};

// The parent supplies the image being viewed; `null` keeps the dialog closed.
type ProductImagePreviewDialogProps = {
  image: SimpleFileView | null;
  onClose: () => void;
};

function ProductImagePreviewDialog({ image, onClose }: ProductImagePreviewDialogProps) {
  const { t } = useTranslation("admin-product");
  // Fullscreen below sm removes the windowed dialog and its backdrop so mobile gets a native-feeling viewer.
  const { smAndDown } = useContext(BreakpointsContext);
  const [swiperRef, setSwiperRef] = useState<SwiperClass>();

  return (
    <Dialog
      open={image !== null}
      fullScreen={smAndDown}
      maxWidth="lg"
      fullWidth
      slotProps={{ paper: { sx: { bgcolor: "common.black" } } }}
      onClose={onClose}>
      <IconButton
        aria-label={t("close")}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          // Swiper's own elements set z-index: 1, so this must be higher to stay clickable above them.
          zIndex: 2,
          ...overlayButtonSx,
        }}
        onClick={onClose}>
        <CloseIcon />
      </IconButton>
      {/* Re-mounting the slide per image resets any leftover zoom/pan state from the previous preview. */}
      {image && (
        <Swiper
          key={image.id}
          modules={[Zoom]}
          zoom={{ maxRatio: 4 }}
          style={{ width: "100%", height: smAndDown ? "100dvh" : "80vh" }}
          onSwiper={setSwiperRef}>
          <SwiperSlide style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="swiper-zoom-container">
              <Box
                component="img"
                src={CONFIG.FILE_URL + image.filePath}
                alt={image.name}
                sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
              />
            </div>
          </SwiperSlide>
        </Swiper>
      )}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          // Swiper's own elements set z-index: 1, so this must be higher to stay clickable above them.
          zIndex: 2,
        }}>
        <IconButton sx={overlayButtonSx} onClick={() => swiperRef?.zoom.out()}>
          <ZoomOutIcon />
        </IconButton>
        <IconButton sx={overlayButtonSx} onClick={() => swiperRef?.zoom.in()}>
          <ZoomInIcon />
        </IconButton>
      </Stack>
    </Dialog>
  );
}

export default ProductImagePreviewDialog;
