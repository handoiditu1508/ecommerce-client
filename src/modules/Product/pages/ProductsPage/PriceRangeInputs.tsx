import { toVndCurrency } from "@/common/format";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { ActionDispatch, ChangeEventHandler } from "react";
import { IMaskInput } from "react-imask";
import { ProductsReducerAction, ProductsReducerState } from "./useProductsReducer";

export type PriceRangeInputsProps = {
  productsState: ProductsReducerState;
  productsDispatch: ActionDispatch<[ProductsReducerAction]>;
};

type PriceMaskCustomProps = {
  onChange: (event: { target: { value: string; }; }) => void;
  ref?: React.Ref<HTMLInputElement>;
};

function PriceMaskCustom({ onChange, ref, ...props }: PriceMaskCustomProps) {
  return (
    <IMaskInput
      {...props}
      mask={Number}
      thousandsSeparator="."
      inputRef={ref}
      overwrite
      onAccept={(_value, mask) => onChange({ target: { value: mask.unmaskedValue } })}
    />
  );
}

function PriceRangeInputs({
  productsState,
  productsDispatch,
}: PriceRangeInputsProps) {
  const theme = useTheme();

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

  return (
    <Box sx={{ px: 1 }}>
      <Box sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
      }}>
        <TextField
          label="Min Price"
          size="small"
          value={productsState.minPrice?.toString() ?? ""}
          slotProps={{
            input: {
              inputComponent: PriceMaskCustom as any,
            },
          }}
          onChange={handleMinPriceChange}
        />
        -
        <TextField
          label="Max Price"
          size="small"
          value={productsState.maxPrice?.toString() ?? ""}
          slotProps={{
            input: {
              inputComponent: PriceMaskCustom as any,
            },
          }}
          onChange={handleMaxPriceChange}
        />
      </Box>
      <Typography variant="body2" sx={{ mt: 1 }}>
        {productsState.minPrice === undefined && productsState.maxPrice === undefined && "Any price"}
        {productsState.minPrice === undefined && productsState.maxPrice !== undefined && <>
          No greater than <span style={{ color: theme.vars.palette.primary.main }}>{toVndCurrency(productsState.maxPrice)}</span>
        </>}
        {productsState.minPrice !== undefined && productsState.maxPrice === undefined && <>
          No lesser than <span style={{ color: theme.vars.palette.primary.main }}>{toVndCurrency(productsState.minPrice)}</span>
        </>}
        {productsState.minPrice !== undefined && productsState.maxPrice !== undefined && <>
          From <span style={{ color: theme.vars.palette.primary.main }}>{toVndCurrency(productsState.minPrice)}</span>
          {" "}to <span style={{
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
