import { toVndCurrency } from "@/common/format";
import CurrencyMaskInput from "@/components/CurrencyMaskInput";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { InputBaseComponentProps } from "@mui/material/InputBase";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { ActionDispatch, ChangeEventHandler } from "react";
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

  const handleMinPriceChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.value === "") {
      productsDispatch({
        type: "SET_MIN_PRICE",
        payload: undefined,
      });

      return;
    }

    const numb = parseInt(event.target.value);
    if (isNaN(numb) || numb < 0) {
      return;
    }

    productsDispatch({
      type: "SET_MIN_PRICE",
      payload: numb,
    });
  };

  const handleMaxPriceChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.value === "") {
      productsDispatch({
        type: "SET_MAX_PRICE",
        payload: undefined,
      });

      return;
    }

    const numb = parseInt(event.target.value);
    if (isNaN(numb) || numb < 0) {
      return;
    }

    productsDispatch({
      type: "SET_MAX_PRICE",
      payload: numb,
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
        <TextField
          label={tProduct("min_price")}
          size="small"
          value={productsState.minPrice?.toString() ?? ""}
          slotProps={{
            input: {
              inputComponent: CurrencyMaskInput as unknown as React.ElementType<InputBaseComponentProps>,
            },
          }}
          onChange={handleMinPriceChange}
        />
        <IconButton size="small" aria-label="swap price" onClick={handleSwapPrices}>
          <SwapHorizIcon fontSize="inherit" />
        </IconButton>
        <TextField
          label={tProduct("max_price")}
          size="small"
          error={productsState.minPrice !== undefined && productsState.maxPrice !== undefined && productsState.maxPrice < productsState.minPrice}
          value={productsState.maxPrice?.toString() ?? ""}
          slotProps={{
            input: {
              inputComponent: CurrencyMaskInput as unknown as React.ElementType<InputBaseComponentProps>,
            },
          }}
          onChange={handleMaxPriceChange}
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
            color: productsState.maxPrice < productsState.minPrice ? theme.vars.palette.error.main : theme.vars.palette.primary.main,
          }}>
            {toVndCurrency(productsState.maxPrice)}
          </span>
        </>}
      </Typography>
    </Box>
  );
}

export default PriceRangeInputs;
