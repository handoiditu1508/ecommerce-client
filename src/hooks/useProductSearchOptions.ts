import { DynamicInputOption } from "@/components/DynamicForm/models";
import { useLazyGetProductsQuery } from "@/redux/apis/productApi";
import { AutocompleteInputChangeReason } from "@mui/material/Autocomplete";
import { useEffect, useMemo, useState } from "react";
import { FieldValues, Path } from "react-hook-form";
import useDebounce from "./useDebounce";

const MIN_SEARCH_LENGTH = 3;
const DEBOUNCE_MS = 300;

/**
 * Debounced product name search for `inputType: "autocomplete"` fields, only querying once at
 * least `MIN_SEARCH_LENGTH` characters have been typed.
 * @param excludedProductIds Product ids to leave out of the search results (e.g. products already chosen in a sibling field).
 * @param knownProducts Products already known to be selected (e.g. loaded from an existing entity), shown even before a search is made.
 */
function useProductSearchOptions<T extends FieldValues, K extends Path<T>>(
  excludedProductIds: number[] = [],
  knownProducts: { id: number; name: string; }[] = [],
) {
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, DEBOUNCE_MS);
  const [trigger, result] = useLazyGetProductsQuery();

  useEffect(() => {
    if (debouncedSearchText.length < MIN_SEARCH_LENGTH) return;

    trigger({
      name: debouncedSearchText,
      excludedProductIds,
      allPages: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchText, trigger]);

  const options = useMemo<DynamicInputOption<T, K>[]>(() => {
    const searchedProducts = result.data ?? [];
    const searchedProductIds = new Set(searchedProducts.map((product) => product.id));
    const products = [
      ...knownProducts.filter((product) => !searchedProductIds.has(product.id)),
      ...searchedProducts,
    ];

    return products.map((product) => ({
      key: product.id,
      label: product.name,
      value: product.id as DynamicInputOption<T, K>["value"],
    }));
  }, [result.data, knownProducts]);

  const onInputChange = (_event: React.SyntheticEvent, value: string, reason: AutocompleteInputChangeReason) => {
    if (reason === "input") setSearchText(value);
  };

  return { options, loading: result.isFetching, onInputChange };
}

export default useProductSearchOptions;
