import Suspense from "@/components/Suspense";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";

function EmptyLayout() {
  return (
    <Box sx={{ height: "100vh" }}>
      <Suspense>
        <Outlet />
      </Suspense>
    </Box>
  );
}

export default EmptyLayout;
