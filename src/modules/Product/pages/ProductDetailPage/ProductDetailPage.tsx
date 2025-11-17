import { toVndCurrency } from "@/common/formats";
import CustomLink from "@/components/CustomLink";
import { BreakpointsContext, smAndDownMediaQuery, smMediaQuery } from "@/contexts/breakpoints";
import LayoutContainer from "@/layouts/ClientLayout/LayoutContainer";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import ProductAttributeSelector from "./ProductAttributeSelector";
import ProductAttributeSelectorDialog from "./ProductAttributeSelectorDialog";
import ProductDescription from "./ProductDescription";
import QuantityInput from "./QuantityInput";
import RelatedProducts from "./RelatedProducts";
import SocialSharingButtonGroup from "./SocialSharingButtonGroup";

function ProductDetailPage() {
  const theme = useTheme();
  const { xsAndDown, smAndDown, sm, smAndUp, mdAndUp } = useContext(BreakpointsContext);
  const [swiperRef, setSwiperRef] = useState<SwiperClass>();
  const [attributeDialogOpen, setAttributeDialogOpen] = useState(false);

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
    <LayoutContainer disableGutters={false}>
      <Box
        component="section"
        sx={{
          display: "flex",
          mt: 1,
          gap: 2,
        }}>
        {/* left */}
        <Box sx={{
          flexgrow: 0,
          flexShrink: 0,
          width: 434,
          maxWidth: `calc((100% - ${theme.spacing(2)}) / 2)`,
          flexDirection: "column",
          [smAndDownMediaQuery(theme.breakpoints)]: {
            flexGrow: 1,
            flexShrink: 1,
            maxWidth: "100%",
            width: "initial",
            display: "flex",
          },
        }}>
          {smAndDown && <Box sx={{ mb: 4 }}>
            <Typography variant="h3">Product Title</Typography>
            <Stack direction="row" alignItems={{ xs: "flex-end", sm: "center" }}>
              <Box>
                <Typography variant="subtitle1">Brand <CustomLink to="">Product Brand</CustomLink></Typography>
                {xsAndDown && <>
                  <Typography variant="h5" color="primary" fontWeight={700}>{toVndCurrency(80000)}</Typography>
                  <Typography variant="body1" color="textDisabled" sx={{ textDecorationLine: "line-through", display: "inline" }}>{toVndCurrency(100000)}</Typography>
                  <Typography component="sup" color="error" variant="caption"> -20%</Typography>
                </>}
              </Box>
              <Box sx={{ flex: 1 }} />
              <Stack direction="row" alignItems="center">
                <Rating defaultValue={3.3} readOnly />
                <Typography variant="subtitle2" component="p" align="right">(3.3) 1k Reviews</Typography>
              </Stack>
            </Stack>
          </Box>}
          {xsAndDown && <SocialSharingButtonGroup />}
          {/* image carousel */}
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            maxWidth: "100%",
            alignItems: "flex-start",
            ".swiper": {
              maxWidth: "100%",
              height: "100%",
            },
            ".swiper-slide": {
              width: 96,
              height: 96,
            },
            [smMediaQuery(theme.breakpoints)]: {
              flexDirection: "row",
              aspectRatio: "1/0.8",
            },
          }}>
            <Box
              component="img"
              src="https://placehold.co/600x400"
              alt="Product Image"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                aspectRatio: "1/1",
                [smMediaQuery(theme.breakpoints)]: {
                  flex: 1,
                },
              }}
            />
            <Swiper
              spaceBetween={8}
              slidesPerView="auto"
              direction={sm ? "vertical" : "horizontal"}
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
                  [smMediaQuery(theme.breakpoints)]: {
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%) rotateZ(90deg)",
                  },
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
                  [smMediaQuery(theme.breakpoints)]: {
                    bottom: 0,
                    top: "initial",
                    right: "50%",
                    transform: "translateX(50%) rotateZ(90deg)",
                  },
                }}
                onClick={handleNextThumbnail}>
                <ArrowForwardIosIcon />
              </IconButton>
            </Swiper>
          </Box>
          {smAndUp && <Box sx={{
            display: "flex",
            mt: 1,
            justifyContent: "space-between",
          }}>
            <SocialSharingButtonGroup />
            {sm && <Box>
              <Typography variant="h5" color="primary" fontWeight={700}>{toVndCurrency(80000)}</Typography>
              <Typography variant="body1" color="textDisabled" sx={{ textDecorationLine: "line-through", display: "inline" }}>{toVndCurrency(100000)}</Typography>
              <Typography component="sup" color="error" variant="caption"> -20%</Typography>
            </Box>}
          </Box>}
          {smAndDown && <>
            <QuantityInput />
            <Button
              size="large"
              sx={{
                width: "100%",
                maxWidth: 500,
                mt: 4,
                mx: "auto",
              }}
              onClick={() => setAttributeDialogOpen(true)}>
              Add to cart
            </Button>
            <ProductAttributeSelectorDialog open={attributeDialogOpen} onClose={() => setAttributeDialogOpen(false)} />
          </>}
        </Box>
        {/* right */}
        {mdAndUp && <Box sx={{
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
        </Box>}
      </Box>
      <RelatedProducts />
      <ProductDescription />
    </LayoutContainer>
  );
}

export default ProductDetailPage;

// todo: reorganize components
