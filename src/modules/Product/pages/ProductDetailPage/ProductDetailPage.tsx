import { toVndCurrency } from "@/common/formats";
import CustomLink from "@/components/CustomLink";
import LayoutContainer from "@/layouts/ClientLayout/LayoutContainer";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FacebookIcon from "@mui/icons-material/Facebook";
import RedditIcon from "@mui/icons-material/Reddit";
import XIcon from "@mui/icons-material/X";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import ProductAttributeSelector from "./ProductAttributeSelector";
import QuantityInput from "./QuantityInput";
import RelatedProducts from "./RelatedProducts";

function ProductDetailPage() {
  const theme = useTheme();
  const [swiperRef, setSwiperRef] = useState<SwiperClass>();

  const handlePrevThumbnail = () => {
    if (swiperRef) {
      swiperRef.slidePrev();
    }
  };

  const handleNextThumbnail = () => {
    if (swiperRef) {
      swiperRef.slideNext();
    }
  };

  return (
    <LayoutContainer>
      <Box sx={{
        display: "flex",
        pt: 1,
        px: 1,
        gap: 2,
      }}>
        {/* left */}
        <Box sx={{
          flexgrow: 0,
          flexShrink: 0,
          width: 434,
          maxWidth: `calc((100% - ${theme.spacing(2)}) / 2)`,
          ".swiper-slide": {
            width: 96,
            height: 96,
          },
        }}>
          <Box
            component="img"
            src="https://placehold.co/600x400"
            alt="Product Image"
            sx={{
              width: "100%",
              aspectRatio: "1/1",
              objectFit: "cover",
            }}
          />
          <Swiper
            spaceBetween={8}
            slidesPerView="auto"
            onSwiper={setSwiperRef}
          >
            {[...new Array(8)].map((_, index) => <SwiperSlide key={index}>
              <Box
                component="img"
                src="https://placehold.co/600x400"
                alt={`Thumbnail ${index + 1}`}
                sx={{
                  width: 96,
                  height: 96,
                  objectFit: "cover",
                }}
              />
            </SwiperSlide>)}
            <IconButton
              sx={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
                opacity: 0.5,
              }}
              onClick={handlePrevThumbnail}>
              <ArrowForwardIosIcon sx={{ transform: "rotateZ(180deg)" }} />
            </IconButton>
            <IconButton
              sx={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
                opacity: 0.5,
              }}
              onClick={handleNextThumbnail}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Swiper>
          <Box sx={{
            mt: 1,
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}>
            <Typography variant="subtitle2">SHARE</Typography>
            <IconButton sx={{ color: "#1877f2" }}>
              <FacebookIcon />
            </IconButton>
            <IconButton sx={{ color: "#000000" }}>
              <XIcon />
            </IconButton>
            <IconButton sx={{ color: "#ff4500" }}>
              <RedditIcon />
            </IconButton>
          </Box>
        </Box>
        {/* right */}
        <Box sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}>
          <Typography variant="h3">Product Title</Typography>
          <Typography variant="subtitle1">Brand <CustomLink to="">Product Brand</CustomLink></Typography>
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}>
            <Box>
              <Typography variant="h5" color="primary" fontWeight={700}>{toVndCurrency(80000)}</Typography>
              <Typography variant="body1" color="textDisabled" sx={{ textDecorationLine: "line-through", display: "inline" }}>{toVndCurrency(100000)}</Typography>
              <Typography component="sup" color="error" variant="caption"> -20%</Typography>
            </Box>
            <Box>
              <Rating defaultValue={3.3} readOnly />
              <Typography variant="subtitle2" component="p" align="right">(3.3) 1k Reviews</Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
          <ProductAttributeSelector />
          <QuantityInput />
          <Button
            size="large"
            sx={{
              width: "100%",
              maxWidth: 500,
              mt: 4,
              mx: "auto",
            }}>
            Add to cart
          </Button>
        </Box>
      </Box>
      <RelatedProducts />
    </LayoutContainer>
  );
}

export default ProductDetailPage;
