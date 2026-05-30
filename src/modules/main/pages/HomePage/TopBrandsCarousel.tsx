import CONFIG from "@/configs";
import { BreakpointsContext, smMediaQuery, xsAndDownMediaQuery } from "@/contexts/breakpoints";
import { useGetTopBrandsQuery } from "@/redux/apis/brandApi";
import Avatar, { avatarClasses } from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Skeleton, { skeletonClasses } from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { Autoplay, FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

function TopBrandsCarousel() {
  const { mdAndUp, xsAndDown } = useContext(BreakpointsContext);
  const theme = useTheme();
  const getTopBrandsResult = useGetTopBrandsQuery();
  const isHiddden = !getTopBrandsResult.isFetching && !getTopBrandsResult.data;
  const slidesPerView = mdAndUp ? 4 : (xsAndDown ? 2 : 3);

  return (!isHiddden && (
    <Paper
      square
      sx={{
        mt: 4,
        py: 4,
        ".swiper": {
          mt: 4,
        },
        ".swiper-slide": {
          width: "25%", // 100% / slidesPerView
          [smMediaQuery(theme.breakpoints)]: {
            width: "33.33%",
          },
          [xsAndDownMediaQuery(theme.breakpoints)]: {
            width: "50%",
          },
          "> *": {
            marginX: "auto",
          },
        },
        [`.${avatarClasses.root}, .${skeletonClasses.root}`]: {
          width: 120,
          height: 120,
          [smMediaQuery(theme.breakpoints)]: {
            width: 100,
            height: 100,
          },
          [xsAndDownMediaQuery(theme.breakpoints)]: {
            width: 80,
            height: 80,
          },
        },
      }}>
      <Typography variant="h5" textAlign="center">Top Brands</Typography>
      <Swiper
        slidesPerView={slidesPerView}
        loop
        freeMode
        autoplay={{
          delay: 2500,
        }}
        modules={[FreeMode, Navigation, Autoplay]}
      >
        {getTopBrandsResult.isLoading
          ? [...new Array(4)].map((_, index) => <SwiperSlide key={index}>
            <Skeleton variant="circular" />
          </SwiperSlide>)
          : (getTopBrandsResult.data || CONFIG.EMPTY_ARRAY).map((brand) => <SwiperSlide key={brand.id}>
            {brand.logoPath
              ? <Avatar
                alt={brand.name}
                variant="square"
                src={CONFIG.FILE_URL + brand.logoPath}
                component={Link}
                to={`/products?brand=${brand.id}`}
              />
              : <Skeleton
                variant="circular"
                component={Link}
                to={`/products?brand=${brand.id}`}
              />}
          </SwiperSlide>)}
      </Swiper>
    </Paper>
  ));
}

export default TopBrandsCarousel;
