import { currentUrlWithPage } from "@/common/url";
import ProductCardList from "@/components/ProductCardList";
import { BreakpointsContext, smAndDownMediaQuery } from "@/contexts/breakpoints";
import { CountSearchProductsQuery, SearchProductsQuery } from "@/models/apis/product/searchProducts";
import { useCountSearchProductsQuery, useSearchProductsQuery } from "@/redux/apis/productApi";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import FilterChips from "./FilterChips";
import FilterCriteria from "./FilterCriteria";
import Searchbar, { SearchOrderingValue } from "./Searchbar";
import Sidebar from "./Sidebar";
import useProductsReducer from "./useProductsReducer";

const PAGE_SIZE = 20;

function ProductsPage() {
  // get url search params
  const [searchParams] = useSearchParams();
  const { t: tProduct } = useTranslation("product");
  const searchOrdering = (searchParams.get("sort") as SearchOrderingValue | null) ?? "createdDate-desc";
  const [sortBy, SortOrder] = searchOrdering?.split("-", 2) ?? [];
  const searchText = searchParams.get("search") ?? "";
  const categoryIds = searchParams.getAll("category").map((id) => parseInt(id));
  const categoryIdsStr = categoryIds.join(",");
  const brandIds = searchParams.getAll("brand").map((id) => parseInt(id));
  const brandIdsStr = brandIds.join(",");
  const minPrice = parseInt(searchParams.get("min")!) || undefined;
  const maxPrice = parseInt(searchParams.get("max")!) || undefined;
  const page = parseInt(searchParams.get("page")!) || 1;
  const query = useMemo<SearchProductsQuery>(() => ({
    searchText,
    categoryIds,
    brandIds,
    includeSubCategories: false, // disabled since tree view will auto select all children
    minPrice,
    maxPrice,
    sortBy,
    sortOrder: SortOrder.toLowerCase() === "desc" ? "desc" : "asc",
    page,
    pageSize: PAGE_SIZE,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [brandIdsStr, categoryIdsStr, maxPrice, minPrice, sortBy, SortOrder, page, searchText]);
  const countQuery = useMemo<CountSearchProductsQuery>(() => ({
    searchText,
    categoryIds,
    brandIds,
    includeSubCategories: false, // disabled since tree view will auto select all children
    minPrice,
    maxPrice,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [brandIdsStr, categoryIdsStr, maxPrice, minPrice, searchText]);

  const theme = useTheme();
  const { xsAndDown, mdAndUp, smAndDown } = useContext(BreakpointsContext);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [productsState, productsDispatch] = useProductsReducer({
    searchText,
    searchOrdering,
    categoryIds,
    brandIds,
    minPrice,
    maxPrice,
    query,
  });
  const searchProductsResult = useSearchProductsQuery(query);
  const countProductsResult = useCountSearchProductsQuery(countQuery);
  const totalPage = countProductsResult.data !== undefined ? Math.ceil(countProductsResult.data / PAGE_SIZE) : 1;

  useEffect(() => {
    productsDispatch({
      type: "SET_QUERY",
      payload: query,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const SearchbarComponent = (
    <Searchbar
      productsState={productsState}
      productsDispatch={productsDispatch}
    />
  );

  return (
    <Box sx={{
      mt: 2,
      display: "flex",
      [smAndDownMediaQuery(theme.breakpoints)]: {
        flexDirection: "column",
        mt: 0,
      },
    }}>
      {mdAndUp && <Sidebar productsState={productsState} productsDispatch={productsDispatch} />}
      {smAndDown && (
        <Box sx={{
          borderBottom: theme.vars.shape.smallBorder,
          pb: 2,
        }}>
          {SearchbarComponent}
          <Divider sx={{ my: 2 }} variant="middle">
            <ButtonBase
              sx={{
                ...theme.typography.caption,
                display: "flex",
                alignItems: "center",
                px: 0.5,
                borderRadius: theme.vars.shape.borderRadius,
                color: theme.vars.palette.primary.main,
              }}
              onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}>
              {tProduct("advanced_search")}
              <ExpandMoreIcon
                fontSize="small"
                sx={{
                  transform: isAdvancedSearchOpen ? "rotateZ(180deg)" : undefined,
                  transition: theme.transitions.create("transform", {
                    duration: theme.transitions.duration.short,
                    easing: theme.transitions.easing.sharp,
                  }),
                }}
              />
            </ButtonBase>
          </Divider>
          <Collapse in={isAdvancedSearchOpen}>
            <FilterCriteria productsState={productsState} productsDispatch={productsDispatch} />
          </Collapse>
        </Box>
      )}
      <Box sx={{
        flex: 1,
      }}>
        {mdAndUp && SearchbarComponent}
        <Box sx={{
          display: "flex",
          mt: 1,
          ml: 2,
          pr: 1,
          gap: 1,
        }}>
          <FilterChips query={query} />
          {countProductsResult.data && <Typography variant="caption" color="textDisabled">{tProduct("results_found", { count: countProductsResult.data })}</Typography>}
        </Box>
        {
          searchProductsResult.isUninitialized
            ? <Typography color="textDisabled" variant="h6" textAlign="center">{tProduct("search_placeholder_hint")}</Typography>
            : <>
              <ProductCardList products={searchProductsResult.data} loading={searchProductsResult.isLoading} />
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                  count={totalPage}
                  color="primary"
                  showFirstButton={!xsAndDown}
                  hidePrevButton={xsAndDown}
                  hideNextButton={xsAndDown}
                  showLastButton={!xsAndDown}
                  page={page}
                  disabled={countProductsResult.isLoading}
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={currentUrlWithPage(item.page).toString()}
                      preventScrollReset
                      {...item}
                    />
                  )}
                />
              </Box>
            </>
        }
      </Box>
    </Box>
  );
}

export default ProductsPage;
