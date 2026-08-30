import DynamicForm, { DynamicFormModel } from "@/components/DynamicForm";
import { DynamicInputOption } from "@/components/DynamicForm/models";
import useAppDispatch from "@/hooks/useAppDispatch";
import useDebounce from "@/hooks/useDebounce";
import { useLazyGetGiftsQuery } from "@/redux/apis/giftApi";
import { useUpdateGiftPromotionGiftsMutation } from "@/redux/apis/giftPromotionApi";
import { pushNotification } from "@/redux/slices/notificationSlice";
import GiftPromotion, { GiftPromotionDetail } from "@/models/entities/GiftPromotion";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { AutocompleteInputChangeReason } from "@mui/material/Autocomplete";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type GiftPromotionGiftsFormModel = {
  id: number;
  giftPromotionDetails: GiftPromotionDetail[];
};

type GiftIdPath = `giftPromotionDetails.${number}.giftId`;

type GiftOption = DynamicInputOption<GiftPromotionGiftsFormModel, GiftIdPath>;

type GiftOptionsMap = Partial<Record<GiftIdPath, GiftOption[]>>;

type GiftInputChangeHandler = (
  event: React.SyntheticEvent, value: string, reason: AutocompleteInputChangeReason
) => void;

type GiftPromotionGiftsFormProps = {
  giftPromotion: GiftPromotion;
};

const MIN_SEARCH_LENGTH = 3;

const formModel: DynamicFormModel<GiftPromotionGiftsFormModel> = {
  inputs: [
    {
      name: "giftPromotionDetails",
      inputType: "array",
      addButtonText: "admin-gift-promotion:add_gift",
      removeButtonText: "admin-gift-promotion:remove_gift",
      itemInputs: [
        {
          name: "giftId",
          inputType: "autocomplete",
          label: "admin-gift-promotion:gift",
          required: true,
          searchAsYouType: true,
          options: [],
          size: { sm: 8 },
          rules: { required: "translation:this_field_is_required" },
        },
        {
          name: "quantity",
          inputType: "number",
          min: 1,
          label: "admin-gift-promotion:quantity",
          required: true,
          size: { sm: 4 },
          rules: { required: "translation:this_field_is_required" },
        },
      ],
      createDefaultValue: () => ({ giftId: 0, quantity: 1 }),
    },
  ],
  submitButtonText: "admin-gift-promotion:update_gifts",
};

function GiftPromotionGiftsForm({ giftPromotion }: GiftPromotionGiftsFormProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["admin-gift-promotion", "translation"]);
  const [updateGiftPromotionGifts, updateResult] = useUpdateGiftPromotionGiftsMutation();
  const [triggerSearch, searchResult] = useLazyGetGiftsQuery();
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 300);

  useEffect(() => {
    if (debouncedSearchText.length < MIN_SEARCH_LENGTH) return;

    triggerSearch({ name: debouncedSearchText });
  }, [debouncedSearchText, triggerSearch]);

  const formValues = useMemo<GiftPromotionGiftsFormModel>(() => ({
    id: giftPromotion.id,
    giftPromotionDetails: giftPromotion.giftPromotionDetails,
  }), [giftPromotion]);
  const formContext = useForm<GiftPromotionGiftsFormModel>({ values: formValues });
  const details = formContext.watch("giftPromotionDetails");

  const searchedGiftOptions = useMemo<GiftOption[]>(
    () => (searchResult.data ?? []).map((gift) => ({ key: gift.id, label: gift.name, value: gift.id })),
    [searchResult.data],
  );

  // Every row shares the same search results, but each row must keep showing its own already-chosen
  // gift even after the shared search results move on to a different row's query.
  const giftOptionsMap = useMemo<GiftOptionsMap>(() => {
    const searchedGiftIds = new Set(searchedGiftOptions.map((option) => option.value));
    const result: GiftOptionsMap = {};

    details.forEach((detail, index) => {
      const path: GiftIdPath = `giftPromotionDetails.${index}.giftId`;
      const knownOptions = detail.gift && !searchedGiftIds.has(detail.gift.id)
        ? [{ key: detail.gift.id, label: detail.gift.name, value: detail.gift.id }]
        : [];
      result[path] = [...knownOptions, ...searchedGiftOptions];
    });

    return result;
  }, [details, searchedGiftOptions]);

  const onInputChangeMap = useMemo<Partial<Record<GiftIdPath, GiftInputChangeHandler>>>(() => {
    const result: Partial<Record<GiftIdPath, GiftInputChangeHandler>> = {};

    details.forEach((_detail, index) => {
      const path: GiftIdPath = `giftPromotionDetails.${index}.giftId`;
      result[path] = (_event, value, reason) => {
        if (reason === "input") setSearchText(value);
      };
    });

    return result;
  }, [details]);

  const loadingMap = useMemo<Partial<Record<GiftIdPath, boolean>>>(() => {
    const result: Partial<Record<GiftIdPath, boolean>> = {};
    details.forEach((_detail, index) => {
      result[`giftPromotionDetails.${index}.giftId`] = searchResult.isFetching;
    });

    return result;
  }, [details, searchResult.isFetching]);

  const handleSubmit = async (data: GiftPromotionGiftsFormModel) => {
    try {
      await updateGiftPromotionGifts({
        id: data.id,
        giftPromotionDetails: data.giftPromotionDetails.map((detail) => ({
          giftId: detail.giftId,
          quantity: detail.quantity,
        })),
      }).unwrap();
      dispatch(pushNotification({
        text: t("gift_promotion_gifts_updated_successfully"),
        severity: "success",
      }));
    } catch {}
  };

  return (
    <>
      <Divider sx={{ mt: 3, mb: 1 }} textAlign="left">
        <Typography variant="h6" gutterBottom>{t("admin-gift-promotion:update_gifts")}</Typography>
      </Divider>
      <DynamicForm
        formContext={formContext}
        model={formModel}
        loading={updateResult.isLoading}
        optionsMap={giftOptionsMap}
        autocompleteOnInputChangeMap={onInputChangeMap}
        autocompleteLoadingMap={loadingMap}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default GiftPromotionGiftsForm;
