import UKRoundedFlagIcon from "@/icons/UKRoundedFlagIcon";
import VNRoundedFlagIcon from "@/icons/VNRoundedFlagIcon";
import { useTranslation } from "react-i18next";
import TopHeaderSelect, { TopHeaderSelectItem } from "./TopHeaderSelect";

const items: TopHeaderSelectItem[] = [
  {
    title: "Tiếng Việt",
    value: "vi-VN",
    icon: <VNRoundedFlagIcon fontSize="small" />,
  },
  {
    title: "English",
    value: "en-US",
    icon: <UKRoundedFlagIcon fontSize="small" />,
  },
];

function LanguageSelect() {
  const { i18n } = useTranslation();

  const selectedValue = i18n.resolvedLanguage || items[0].value;
  const selectedItem = items.find((item) => item.value === selectedValue);

  const handleSelect = (item: TopHeaderSelectItem) => {
    i18n.changeLanguage(item.value as string);
  };

  return (
    <TopHeaderSelect
      items={items}
      selectedItem={selectedItem}
      onSelect={handleSelect}
    />
  );
}

export default LanguageSelect;
