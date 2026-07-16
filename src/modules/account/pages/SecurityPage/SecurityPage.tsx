import Box from "@mui/material/Box";
import ChangeEmailCard from "./ChangeEmailCard";
import ChangePasswordCard from "./ChangePasswordCard";
import TwoFaCard from "./TwoFaCard";

function SecurityPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <ChangeEmailCard />
      <ChangePasswordCard />
      <TwoFaCard />
    </Box>
  );
}

export default SecurityPage;
