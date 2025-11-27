import { BreakpointsContext, smMediaQuery } from "@/contexts/breakpoints";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import { useContext, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

function ImageCarousel() {
  const theme = useTheme();
  const { sm } = useContext(BreakpointsContext);
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
  );
}

export default ImageCarousel;
