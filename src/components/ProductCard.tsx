import { smAndDownMediaQuery, xsAndDownMediaQuery } from "@/contexts/breakpoints";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

function ProductCard() {
  const theme = useTheme();

  return (
    <Card sx={{
      boxSizing: "border-box",
      maxWidth: 200,
      [smAndDownMediaQuery(theme.breakpoints)]: {
        maxWidth: 180,
      },
      [xsAndDownMediaQuery(theme.breakpoints)]: {
        maxWidth: 145,
      },
    }}>
      <CardActionArea disableRipple>
        <CardMedia
          component="img"
          image="https://placehold.co/600x400"
          alt="Place holder"
          sx={{
            aspectRatio: "1 / 1",
          }}
        />
        <CardContent sx={{
          p: 1,
          height: 84,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          "&:last-child": {
            pb: 1,
          },
          [smAndDownMediaQuery(theme.breakpoints)]: {
            height: 74,
          },
          [xsAndDownMediaQuery(theme.breakpoints)]: {
            height: 59,
          },
        }}>
          <Tooltip title="Product name zxc sdfd asdas" placement="top">
            <Typography variant="body1" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">Product name zxc sdfd asdas</Typography>
          </Tooltip>
          <Typography variant="body2" color="textSecondary" sx={{ marginTop: "auto" }}>₫300.000</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ProductCard;
