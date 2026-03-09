import { smAndDownMediaQuery, xsAndDownMediaQuery } from "@/contexts/breakpoints";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";

function ProductCardSkeleton() {
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
      <Skeleton variant="rectangular" width="initial" height="initial" sx={{ aspectRatio: "1 / 1" }} />
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
        <Skeleton variant="text" sx={{ ...theme.typography.body1 }} />
        <Skeleton variant="text" width="40%" sx={{ ...theme.typography.body2, marginTop: "auto" }} />
      </CardContent>
    </Card>
  );
}

export default ProductCardSkeleton;
