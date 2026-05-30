import { toVndCurrency } from "@/common/format";
import useAppSelector from "@/hooks/useAppSelector";
import { SearchProductsQuery } from "@/models/apis/product/searchProducts";
import { useGetBrandsHaveActiveProductQuery } from "@/redux/apis/brandApi";
import { useGetCategoryTreesQuery } from "@/redux/apis/categoryApi";
import { brandSelectors } from "@/redux/slices/brandSlice";
import { categorySelectors } from "@/redux/slices/categorySlice";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useSearchParams } from "react-router-dom";

export type FilterChipsProps = {
  query: SearchProductsQuery;
};

function CategoryChip({ id }: { id: number; }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = useAppSelector(categorySelectors.byId(id));

  const handleDelete = (event: Event) => {
    event.preventDefault();
    if (searchParams.has("category", id.toString())) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("category", id.toString());
      setSearchParams(newSearchParams);
    }
  };

  return (
    category && <Chip
      label={category.name}
      size="small"
      color="secondary"
      component="a"
      href={`${document.location.pathname}?category=${id}`}
      target="_blank"
      clickable
      onDelete={handleDelete}
    />
  );
}

function BrandChip({ id }: { id: number; }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const brand = useAppSelector(brandSelectors.byId(id));

  const handleDelete = (event: Event) => {
    event.preventDefault();
    if (searchParams.has("brand", id.toString())) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("brand", id.toString());
      setSearchParams(newSearchParams);
    }
  };

  return (
    brand && <Chip
      label={brand.name}
      size="small"
      color="success"
      component="a"
      href={`${document.location.pathname}?brand=${id}`}
      target="_blank"
      clickable
      onDelete={handleDelete}
    />
  );
}

function FilterChips({
  query,
}: FilterChipsProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // get brands if not already fetched
  useGetBrandsHaveActiveProductQuery();

  // get categories if not already fetched
  useGetCategoryTreesQuery();

  const handleDeletePrice = (event: Event, paramKey: string) => {
    event.preventDefault();
    if (searchParams.has(paramKey)) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete(paramKey);
      setSearchParams(newSearchParams);
    }
  };

  return (
    <Box sx={{
      flex: 1,
      display: "flex",
      gap: 0.5,
      flexWrap: "wrap",
    }}>
      {query.categoryIds.map((id) => <CategoryChip key={id} id={id} />)}
      {query.brandIds.map((id) => <BrandChip key={id} id={id} />)}
      {query.minPrice !== undefined && <Chip
        label={`≥ ${toVndCurrency(query.minPrice)}`}
        size="small"
        color="info"
        component="a"
        href={`${document.location.pathname}?min=${query.minPrice}`}
        target="_blank"
        clickable
        onDelete={(e) => handleDeletePrice(e, "min")}
      />}
      {query.maxPrice !== undefined && <Chip
        label={`≤ ${toVndCurrency(query.maxPrice)}`}
        size="small"
        color="warning"
        component="a"
        href={`${document.location.pathname}?max=${query.maxPrice}`}
        target="_blank"
        clickable
        onDelete={(e) => handleDeletePrice(e, "max")}
      />}
    </Box>
  );
}

export default FilterChips;
