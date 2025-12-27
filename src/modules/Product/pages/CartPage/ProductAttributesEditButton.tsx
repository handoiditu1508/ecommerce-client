import { smAndUpMediaQuery } from "@/contexts/breakpoints";
import EditIcon from "@mui/icons-material/Edit";
import ButtonBase from "@mui/material/ButtonBase";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import ProductAttributeSelectorDialog from "../../components/ProductAttributeSelectorDialog";

function ProductAttributesEditButton() {
  const theme = useTheme();
  const [attributeDialogOpen, setAttributeDialogOpen] = useState(false);

  const handleClickEditAttributes = () => {
    setAttributeDialogOpen(true);
  };

  return (
    <>
      <ButtonBase
        sx={{
          color: theme.vars.palette.text.secondary,
          display: "flex",
          alignItems: "center",
          width: "fit-content",
          maxWidth: "100%",
          borderRadius: 1,
          backgroundColor: theme.vars.palette.grey[300],
          px: 0.5,
          gap: 0.5,
          [smAndUpMediaQuery(theme.breakpoints)]: {
            mt: 1,
          },
        }}
        onClick={handleClickEditAttributes}>
        <Typography
          variant="caption"
          color="inherit"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis">
          Red, M (50kg - 59kg), Vaporeon
        </Typography>
        <EditIcon color="inherit" fontSize="inherit" />
      </ButtonBase>
      <ProductAttributeSelectorDialog open={attributeDialogOpen} confirmButtonText="Save" onClose={() => setAttributeDialogOpen(false)} />
    </>
  );
}

export default ProductAttributesEditButton;
