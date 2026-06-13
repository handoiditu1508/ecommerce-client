import { toVndCurrency } from "@/common/format";
import CONFIG from "@/configs";
import { smAndDownMediaQuery, xsAndDownMediaQuery } from "@/contexts/breakpoints";
import { ProductView } from "@/models/entities/Product";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { CSSProperties } from "react";
import { Link } from "react-router-dom";

type ProductCardProps = {
  product?: ProductView;
};

const getDiscountRibbonText = (product?: ProductView): string => {
  if (!product) return "";

  if (product.discountPercentage) return `-${product.discountPercentage}%`;

  if (product.price !== product.discountPrice) return toVndCurrency(product.discountPrice - product.price);

  return "";
};

function ProductCard({ product }: ProductCardProps) {
  const theme = useTheme();
  const discountRibbonText = getDiscountRibbonText(product);

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
        {...(product && {
          component: Link,
          to: `/products/${product.id}`,
          style: {
            "--discount-ribbon-text": `'${discountRibbonText}'`,
          } as CSSProperties,
          sx: discountRibbonText
            ? {
              position: "relative",
              "&::before": {
                content: "var(--discount-ribbon-text)",
                backgroundColor: product.discountPercentage ? theme.vars.palette.error.main : theme.vars.palette.info.main,
                color: product.discountPercentage ? theme.vars.palette.error.contrastText : theme.vars.palette.info.contrastText,
                textAlign: "center",
                position: "absolute",
                top: 10,
                right: -20,
                ...theme.typography.caption,
                transform: "rotateZ(45deg)",
                width: 80,
              },
            }
            : undefined,
        })}
      >
        {product
          ? <CardMedia
            component="img"
            image={CONFIG.FILE_URL + product.thumbnailPath}
            alt={product.name}
            sx={{
              aspectRatio: "1 / 1",
            }}
          />
          : <Skeleton variant="rectangular" width="initial" height="initial" sx={{ aspectRatio: "1 / 1" }} />}
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
          {product
            ? <>
              <Tooltip title={product.name} placement="top">
                <Typography variant="body1" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">{product.name}</Typography>
              </Tooltip>
              <Typography variant="body2" color="textSecondary" sx={{ marginTop: "auto" }}>
                {toVndCurrency(product.discountPrice)}
                {product.price !== product.discountPrice && <>
              &nbsp;<Box component="sup" sx={{ color: theme.vars.palette.text.disabled, textDecorationLine: "line-through" }}>{toVndCurrency(product.price)}</Box>
                </>}
              </Typography>
            </>
            : <>
              <Skeleton variant="text" sx={{ ...theme.typography.body1 }} />
              <Skeleton variant="text" width="40%" sx={{ ...theme.typography.body2, marginTop: "auto" }} />
            </>}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ProductCard;
