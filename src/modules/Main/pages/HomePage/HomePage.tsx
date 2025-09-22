import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import LayoutContainer from "@/layouts/ClientLayout/LayoutContainer";
import Avatar, { avatarClasses } from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { Autoplay, FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PromotionalProductList from "./PromotionalProductList";

function HomePage() {
  const theme = useTheme();

  return (
    <>
      <LayoutContainer>
        <Box sx={{
          display: "flex",
          aspectRatio: "3 / 1",
          gap: 1,
          [smAndDownMediaQuery(theme.breakpoints)]: {
            flexDirection: "column",
            aspectRatio: "3 / 2",
          },
        }}>
          <Box
            sx={{
              flexGrow: 2,
            }}
            style={{
              backgroundImage: 'url("https://placehold.co/600x400")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            flexGrow: 1,
            [smAndDownMediaQuery(theme.breakpoints)]: {
              flexDirection: "row",
            },
          }}>
            <Box
              sx={{
                flexGrow: 1,
                backgroundImage: 'url("https://placehold.co/600x400")',
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Box
              sx={{
                flexGrow: 1,
                backgroundImage: 'url("https://placehold.co/600x400")',
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </Box>
        </Box>
      </LayoutContainer>
      <PromotionalProductList title="New Collection" />
      <PromotionalProductList title="Popular Products" />
      <Paper
        square
        sx={{
          mt: 4,
          py: 4,
          ".swiper": {
            mt: 4,
          },
          ".swiper-slide": {
            width: 120,
          },
          [`.${avatarClasses.root}`]: {
            width: 120,
            height: 120,
          },
        }}>
        <Typography variant="h5" textAlign="center">Top Brands</Typography>
        <Swiper
          spaceBetween={40}
          slidesPerView="auto"
          loop
          freeMode
          autoplay={{
            delay: 2500,
          }}
          modules={[FreeMode, Navigation, Autoplay]}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {[...new Array(15)].map((_, index) => <SwiperSlide key={index}>
            <Avatar
              alt="Brand logo"
              src="https://placehold.co/600x400"
            />
          </SwiperSlide>)}
        </Swiper>
        <Button
          variant="outlined"
          sx={{ display: "flex", mx: "auto", mt: 4 }}>
          View All
        </Button>
      </Paper>
    </>
  );
}

export default HomePage;
