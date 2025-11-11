import Box from "@mui/material/Box";
import ProductAttibuteValueChip from "./ProductAttibuteValueChip";
import ProductAttribute from "./ProductAttribute";

const productAttributes: ProductAttribute[] = [
  {
    name: "Color",
    values: [
      {
        value: "Red",
        color: "#ff0000",
      },
      {
        value: "Green",
        color: "#008000",
      },
      {
        value: "Blue",
        color: "#0000ff",
      },
      {
        value: "Yellow",
        color: "#ffff00",
      },
      {
        value: "Violet",
        color: "#8000ff",
      },
      {
        value: "Purple",
        color: "#ff00ff",
      },
      {
        value: "Orange",
        color: "#ff8000",
      },
      {
        value: "Pink",
        color: "#ffc0cb",
      },
      {
        value: "Black",
        color: "#000000",
      },
      {
        value: "White",
        color: "#ffffff",
      },
      {
        value: "Dark blue",
        color: "#00008b",
      },
    ],
  },
  {
    name: "Size",
    values: [
      {
        value: "XXS (25kg - 32kg)",
      },
      {
        value: "XS (33kg - 39kg)",
      },
      {
        value: "S (40kg - 49kg)",
      },
      {
        value: "M (50kg - 59kg)",
      },
      {
        value: "L (60kg - 68kg)",
      },
      {
        value: "XL (69kg - 77kg)",
      },
      {
        value: "XXL (78kg - 86kg)",
      },
    ],
  },
  {
    name: "Image",
    values: [
      {
        value: "Vaporeon",
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png",
        color: "#79CEE0",
      },
      {
        value: "Jolteon",
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/135.png",
        color: "#FBD570",
      },
      {
        value: "Flareon",
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/136.png",
        color: "#EB804C",
      },
      {
        value: "Espeon",
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/196.png",
        color: "#E4CDDD",
      },
      {
        value: "Umbreon",
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/197.png",
        color: "#566574",
      },
      {
        value: "Leafeon",
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/470.png",
        color: "#7AC89E",
      },
      {
        value: "Glaceon",
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/471.png",
        color: "#DFF6F0",
      },
      {
        value: "Sylveon",
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/700.png",
        color: "#FAD0D5",
      },
    ],
  },
];

function ProductAttributeSelector() {
  return (
    <Box
      component="table"
      sx={{
        borderCollapse: "collapse",
        th: {
          pr: 1.5,
          verticalAlign: "top",
        },
        "tr:not(:last-of-type)": {
          "th, td": {
            pb: 2,
          },
        },
      }}>
      <tbody>
        {productAttributes.map((a) => <tr key={a.name}>
          <th>{a.name}</th>
          <td>
            <Box sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}>
              {a.values.map((v) => <ProductAttibuteValueChip key={v.value} value={v} />)}
            </Box>
          </td>
        </tr>)}
      </tbody>
    </Box>
  );
}

export default ProductAttributeSelector;
