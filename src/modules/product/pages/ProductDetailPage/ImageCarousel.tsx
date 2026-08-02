import CONFIG from "@/configs";
import { BreakpointsContext, smMediaQuery } from "@/contexts/breakpoints";
import { SimpleFileView } from "@/models/entities/StorageItem";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

type ImageCarouselProps = {
  defaultIndex?: number;
  images?: SimpleFileView[];
};

function ImageCarousel({ defaultIndex = 0, images = CONFIG.EMPTY_ARRAY }: ImageCarouselProps) {
  const theme = useTheme();
  const { sm } = useContext(BreakpointsContext);
  const [swiperRef, setSwiperRef] = useState<SwiperClass>();
  const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex > images.length || defaultIndex < 0 ? 0 : defaultIndex);
  const selectedImage: SimpleFileView | undefined = images[selectedIndex];

  useEffect(() => {
    if (selectedIndex >= images.length) {
      setSelectedIndex(0);
    }
  }, [selectedIndex, images.length]);

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
        width: "100%",
        maxWidth: "100%",
        height: "100%",
      },
      ".swiper-slide": {
        width: 96,
        height: 96,
        [smMediaQuery(theme.breakpoints)]: {
          width: "100%",
          height: "initial",
          aspectRatio: "1/1",
        },
      },
      [smMediaQuery(theme.breakpoints)]: {
        flexDirection: "row",
        aspectRatio: "1/0.8",
      },
    }}>
      {
        selectedImage
          ? (
            <Box
              component="img"
              src={CONFIG.FILE_URL + selectedImage.filePath}
              alt={selectedImage.name}
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
          )
          : (
            <Skeleton
              variant="rectangular"
              sx={{
                width: "100%",
                height: "100%",
                aspectRatio: "1/1",
                [smMediaQuery(theme.breakpoints)]: {
                  flex: 1,
                },
              }}
            />
          )
      }
      <Swiper
        spaceBetween={8}
        slidesPerView="auto"
        direction={sm ? "vertical" : "horizontal"}
        onSwiper={setSwiperRef}
      >
        {images.length
          ? images.map((image, index) => <SwiperSlide key={image.id}>
            <ButtonBase
              sx={{
                width: "100%",
                height: "100%",
                ...(selectedIndex === index && {
                  outline: theme.border.smallBorder,
                  outlineColor: theme.vars.palette.primary.main,
                  outlineOffset: -1,
                }),
              }}
              onClick={() => setSelectedIndex(index)}>
              <Box
                component="img"
                src={CONFIG.FILE_URL + image.filePath}
                alt={image.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </ButtonBase>
          </SwiperSlide>)
          : [...Array(5)].map((_, i) => <SwiperSlide key={i}>
            <Skeleton
              variant="rectangular"
              sx={{
                width: "100%",
                height: "100%",
                [smMediaQuery(theme.breakpoints)]: {
                  width: "100%",
                  height: "initial",
                  aspectRatio: "1/1",
                },
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
