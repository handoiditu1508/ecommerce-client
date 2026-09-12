import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import CONFIG from "@/configs";
import { useGetActivePromotionBannersQuery } from "@/redux/apis/promotionBannerApi";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

function PromotionBannerSlider() {
  const theme = useTheme();
  const getActivePromotionBannersResult = useGetActivePromotionBannersQuery();
  const isHiddden = !getActivePromotionBannersResult.isFetching && !getActivePromotionBannersResult.data?.length;

  return (!isHiddden && (
    <Box sx={{
      aspectRatio: "3 / 1",
      [smAndDownMediaQuery(theme.breakpoints)]: {
        aspectRatio: "3 / 2",
      },
      ".swiper, .swiper-slide": {
        height: "100%",
      },
      ".swiper-slide": {
        "> *": {
          display: "block",
          width: "100%",
          height: "100%",
        },
      },
    }}>
      <Swiper
        slidesPerView={1}
        loop
        navigation
        autoplay={{
          delay: 5000,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Navigation, Pagination, Autoplay]}
      >
        {getActivePromotionBannersResult.isLoading
          ? [...new Array(1)].map((_, index) => <SwiperSlide key={index}>
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </SwiperSlide>)
          : (getActivePromotionBannersResult.data || CONFIG.EMPTY_ARRAY).map((banner) => (
            <SwiperSlide key={banner.id}>
              <Link to={`/products/promotion/${banner.promotionId}`}>
                <Box
                  component="img"
                  src={CONFIG.FILE_URL + banner.imagePath}
                  alt=""
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Link>
            </SwiperSlide>
          ))}
      </Swiper>
    </Box>
  ));
}

export default PromotionBannerSlider;
