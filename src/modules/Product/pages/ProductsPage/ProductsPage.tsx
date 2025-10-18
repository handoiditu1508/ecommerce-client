import ProductCardList from "@/components/ProductCardList";
import Box from "@mui/material/Box";
import Searchbar from "./Searchbar";
import Sidebar from "./Sidebar";

function ProductsPage() {
  return (
    <Box sx={{
      mt: 2,
      display: "flex",
    }}>
      <Sidebar />
      <Box sx={{
        flex: 1,
      }}>
        <Searchbar />
        <ProductCardList quantity={12} />
      </Box>
    </Box>
  );
}

export default ProductsPage;
