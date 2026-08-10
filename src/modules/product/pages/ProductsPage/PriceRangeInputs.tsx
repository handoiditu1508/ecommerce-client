import { toVndCurrency } from "@/common/format";
import CurrencyInput from "@/components/CurrencyInput";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { ActionDispatch } from "react";
import { useTranslation } from "react-i18next";
import { ProductsReducerAction, ProductsReducerState } from "./useProductsReducer";

export type PriceRangeInputsProps = {
  productsState: ProductsReducerState;
  productsDispatch: ActionDispatch<[ProductsReducerAction]>;
};

function PriceRangeInputs({
  productsState,
  productsDispatch,
}: PriceRangeInputsProps) {
  const theme = useTheme();
  const { t: tProduct } = useTranslation("product");

  const handleMinPriceChange = (value: number | undefined) => {
    productsDispatch({
      type: "SET_MIN_PRICE",
      payload: value,
    });
  };

  const handleMaxPriceChange = (value: number | undefined) => {
    productsDispatch({
      type: "SET_MAX_PRICE",
      payload: value,
    });
  };

  const handleSwapPrices: React.MouseEventHandler<HTMLButtonElement> = () => {
    productsDispatch({
      type: "SET_PRICE_RANGE",
      payload: [productsState.maxPrice, productsState.minPrice],
    });
  };

  return (
    <Box sx={{ px: 1 }}>
      <Box sx={{
        display: "flex",
        alignItems: "center",
      }}>
        <CurrencyInput
          label={tProduct("min_price")}
          size="small"
          value={productsState.minPrice}
          onValueChange={handleMinPriceChange}
        />
        <IconButton size="small" aria-label="swap price" onClick={handleSwapPrices}>
          <SwapHorizIcon fontSize="inherit" />
        </IconButton>
        <CurrencyInput
          label={tProduct("max_price")}
          size="small"
          error={
            productsState.minPrice !== undefined
            && productsState.maxPrice !== undefined
            && productsState.maxPrice < productsState.minPrice
          }
          value={productsState.maxPrice}
          onValueChange={handleMaxPriceChange}
        />
      </Box>
      <Typography variant="body2" sx={{ mt: 1 }}>
        {productsState.minPrice === undefined && productsState.maxPrice === undefined && tProduct("any_price")}
        {productsState.minPrice === undefined && productsState.maxPrice !== undefined && <>
          {tProduct("no_greater_than")} <span style={{ color: theme.vars.palette.primary.main }}>{toVndCurrency(productsState.maxPrice)}</span>
        </>}
        {productsState.minPrice !== undefined && productsState.maxPrice === undefined && <>
          {tProduct("no_lesser_than")} <span style={{ color: theme.vars.palette.primary.main }}>{toVndCurrency(productsState.minPrice)}</span>
        </>}
        {productsState.minPrice !== undefined && productsState.maxPrice !== undefined && <>
          {tProduct("from")} <span style={{ color: theme.vars.palette.primary.main }}>{toVndCurrency(productsState.minPrice)}</span>
          {" "}{tProduct("to")} <span style={{
            color: productsState.maxPrice < productsState.minPrice
              ? theme.vars.palette.error.main
              : theme.vars.palette.primary.main,
          }}>
            {toVndCurrency(productsState.maxPrice)}
          </span>
        </>}
      </Typography>
    </Box>
  );
}

export default PriceRangeInputs;
