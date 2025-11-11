import ProductCard from "@/components/ProductCard";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

function RelatedProducts() {
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
    <Container
      maxWidth="md"
      fixed
      sx={{
        mt: 4,
        ".swiper-slide": {
          width: "fit-content",
        },
      }}>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <Typography variant="h5">Related Products</Typography>
        <Button size="small" variant="text">View all</Button>
      </Box>

      <Swiper
        spaceBetween={8}
        slidesPerView="auto"
        loop
        onSwiper={setSwiperRef}
      >
        {[...new Array(8)].map((_, index) => <SwiperSlide key={index}>
          <ProductCard />
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
    </Container>
  );
}

export default RelatedProducts;
