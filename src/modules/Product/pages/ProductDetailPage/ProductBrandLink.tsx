import CustomLink from "@/components/CustomLink";
import { useAppSelector } from "@/hooks";
import { useGetAllBrandsQuery } from "@/redux/apis/brandApi";
import { selectBrandById } from "@/redux/slices/brandsSlice";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

type ProductBrandLinkProps = {
  brandId?: number;
};

function ProductBrandLink({ brandId = 0 }: ProductBrandLinkProps) {
  const getAllBrandsResult = useGetAllBrandsQuery();// load brands if not already loaded
  const brand = useAppSelector(selectBrandById(brandId));

  if (brand) {
    return <CustomLink to={`/products?brand=${brandId}`} variant="subtitle1">{brand.name}</CustomLink>;
  }

  return getAllBrandsResult.isFetching && <Typography variant="subtitle1"><Skeleton variant="text" width="40%" /></Typography>;
}

export default ProductBrandLink;
