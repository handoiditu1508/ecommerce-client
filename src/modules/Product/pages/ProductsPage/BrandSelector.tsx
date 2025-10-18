import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const brands: string[] = [
  "Nike",
  "Adidas",
  "Puma",
  "Reebok",
  "Under Armour",
  "New Balance",
  "Asics",
  "Fila",
  "Converse",
  "Vans",
];

function BrandSelector() {
  return (
    <Box sx={{
      display: "flex",
      flexWrap: "wrap",
      px: 2,
    }}>
      {brands.map((brand, index) => <FormControlLabel
        key={index}
        label={brand}
        slotProps={{
          typography: {
            variant: "body2",
          },
        }}
        control={<Checkbox size="small" />}
      />)}
    </Box>
  );
}

export default BrandSelector;
