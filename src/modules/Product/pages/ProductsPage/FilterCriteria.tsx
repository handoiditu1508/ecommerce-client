import { BreakpointsContext, mdAndUpMediaQuery, smAndDownMediaQuery } from "@/contexts/breakpoints";
import productApi from "@/redux/apis/productApi";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { ActionDispatch, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import BrandSelector from "./BrandSelector";
import CategoryTree from "./CategoryTree";
import PriceRangeInputs from "./PriceRangeInputs";
import { ProductsReducerAction, ProductsReducerState } from "./useProductsReducer";
import { generateSearchParams } from "./utils";

export type FilterCriteriaProps = {
  productsState: ProductsReducerState;
  productsDispatch: ActionDispatch<[ProductsReducerAction]>;
};

function FilterCriteria({
  productsState,
  productsDispatch,
}: FilterCriteriaProps) {
  const theme = useTheme();
  const { mdAndUp, smAndDown } = useContext(BreakpointsContext);
  const searchProductsResult = productApi.endpoints.searchProducts.useQueryState(productsState.query);
  const [, setSearchParams] = useSearchParams();

  const handleSearch = () => {
    setSearchParams(generateSearchParams(productsState));
  };

  const handleClearFilter = () => {
    productsDispatch({ type: "CLEAR_FILTER" });
  };

  return (
    <>
      {mdAndUp && <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mx: 0.5,
      }}>
        <Typography variant="h6" color="primary">Shop by</Typography>
        <ButtonBase
          sx={{
            ...theme.typography.caption,
            border: theme.vars.shape.smallBorder,
            px: 0.5,
            borderRadius: theme.vars.shape.borderRadius,
          }}
          onClick={handleClearFilter}>
          Clear All
        </ButtonBase>
      </Box>}
      <Accordion
        square
        disableGutters
        sx={{
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          "::before": {
            display: "none",
          },
          [smAndDownMediaQuery(theme.breakpoints)]: {
            backgroundColor: "transparent",
          },
        }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>Categories</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{
          px: 0,
          overflow: "auto",
          [smAndDownMediaQuery(theme.breakpoints)]: {
            maxHeight: 300,
          },
        }}>
          <CategoryTree productsState={productsState} productsDispatch={productsDispatch} />
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        disableGutters
        sx={{
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          "::before": {
            display: "none",
          },
          [smAndDownMediaQuery(theme.breakpoints)]: {
            backgroundColor: "transparent",
          },
        }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>Brands</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{
          px: 0,
          overflow: "auto",
        }}>
          <BrandSelector
            productsState={productsState}
            productsDispatch={productsDispatch}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        disableGutters
        sx={{
          border: "none",
          "::before": {
            display: "none",
          },
          [smAndDownMediaQuery(theme.breakpoints)]: {
            backgroundColor: "transparent",
          },
        }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>Price range</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{
          px: 0,
          overflow: "auto",
        }}>
          <PriceRangeInputs
            productsState={productsState}
            productsDispatch={productsDispatch}
          />
        </AccordionDetails>
      </Accordion>
      <Box sx={{ flex: 1 }} />
      <Box sx={{
        display: "flex",
        [smAndDownMediaQuery(theme.breakpoints)]: {
          justifyContent: "flex-end",
          gap: 1,
          mt: 2,
          pr: 1,
        },
      }}>
        <Button
          size="large"
          fullWidth={mdAndUp}
          startIcon={<FilterListIcon />}
          disabled={searchProductsResult.isFetching}
          sx={{
            [mdAndUpMediaQuery(theme.breakpoints)]: {
              borderRadius: 0,
            },
          }}
          onClick={handleSearch}>
          Apply
        </Button>
        {smAndDown && <Button
          size="large"
          variant="outlined"
          endIcon={<FilterListOffIcon />}
          color="inherit"
          onClick={handleClearFilter}>
          Clear
        </Button>}
      </Box>
    </>
  );
}

export default FilterCriteria;
