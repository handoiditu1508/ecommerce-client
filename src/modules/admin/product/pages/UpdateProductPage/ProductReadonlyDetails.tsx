import { toVndCurrency } from "@/common/format";
import Product from "@/models/entities/Product";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

type ProductReadonlyDetailsProps = {
  product: Product;
};

function ProductReadonlyDetails({ product }: ProductReadonlyDetailsProps) {
  const { t } = useTranslation();
  const details = [
    [t("discount_price"), toVndCurrency(product.discountPrice)],
    [t("discount_percentage"), `${product.discountPercentage}%`],
    [t("thumbnail_path"), product.thumbnailPath],
    [t("brand_id"), product.brandId?.toString() ?? t("none")],
    [t("description"), product.description ?? t("none")],
    [t("created_date"), product.createdDate],
    [t("modified_date"), product.modifiedDate],
    [t("created_by"), product.createdBy ?? t("none")],
    [t("modified_by"), product.modifiedBy ?? t("none")],
    [t("deleted"), product.isDeleted ? t("yes") : t("no")],
    [t("deleted_date"), product.deletedDate ?? t("none")],
  ];

  return (
    <>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>{t("product_details_readonly")}</Typography>
      <Grid container spacing={2}>
        {details.map(([label, value]) => (
          <Grid key={label} size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label={label}
              value={value}
              multiline={label === t("description")}
              slotProps={{ input: { readOnly: true } }}
            />
          </Grid>
        ))}
      </Grid>

      <Typography variant="subtitle1" sx={{ mt: 3 }}>{t("images")}</Typography>
      <List dense disablePadding>
        {product.images.length === 0 && <ListItem>{t("none")}</ListItem>}
        {product.images.map((image) => (
          <ListItem key={image.id} disableGutters>
            <ListItemText primary={image.name} secondary={image.filePath} />
          </ListItem>
        ))}
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2 }}>{t("product_variants")}</Typography>
      <List dense disablePadding>
        {product.productVariants.length === 0 && <ListItem>{t("none")}</ListItem>}
        {product.productVariants.map((variant) => (
          <ListItem key={variant.id} disableGutters>
            <ListItemText
              primary={`${variant.name} · ${variant.sku}`}
              secondary={t("product_variant_summary", {
                quantity: variant.quantity,
                price: variant.price === undefined ? t("none") : toVndCurrency(variant.price),
              })}
            />
            {variant.color && <Chip label={variant.color} size="small" />}
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default ProductReadonlyDetails;
