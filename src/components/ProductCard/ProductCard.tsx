import { toVndCurrency } from "@/common/formats";
import CONFIG from "@/configs";
import { smAndDownMediaQuery, xsAndDownMediaQuery } from "@/contexts/breakpoints";
import { ProductView } from "@/models/entities/Product";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { CSSProperties } from "react";
import { Link } from "react-router-dom";

type ProductCardProps = {
  product: ProductView;
};

function ProductCard({ product }: ProductCardProps) {
  const theme = useTheme();

  return (
    <Card sx={{
      boxSizing: "border-box",
      width: 200,
      [smAndDownMediaQuery(theme.breakpoints)]: {
        width: 180,
      },
      [xsAndDownMediaQuery(theme.breakpoints)]: {
        width: 145,
      },
    }}>
      <CardActionArea
        disableRipple
        component={Link}
        to={`/products/${product.id}`}
        style={{
          "--sale-off-percentage": `'-${product.discountPercentage}%'`,
        } as CSSProperties}
        {...(product.discountPercentage && {
          sx: {
            position: "relative",
            "&::before": {
              content: "var(--sale-off-percentage)",
              backgroundColor: theme.vars.palette.error.main,
              color: theme.vars.palette.error.contrastText,
              textAlign: "center",
              position: "absolute",
              top: 10,
              right: -20,
              ...theme.typography.caption,
              transform: "rotateZ(45deg)",
              width: 80,
            },
          },
        })}
      >
        <CardMedia
          component="img"
          image={CONFIG.FILE_URL + product.thumbnailPath}
          alt={product.name}
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
            <Typography variant="body1" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">{product.name}</Typography>
          </Tooltip>
          <Typography variant="body2" color="textSecondary" sx={{ marginTop: "auto" }}>
            {toVndCurrency(product.discountPrice)}
            {!!product.discountPercentage && <>
              &nbsp;<Box component="sup" sx={{ color: theme.vars.palette.text.disabled, textDecorationLine: "line-through" }}>{toVndCurrency(product.price)}</Box>
            </>}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ProductCard;
