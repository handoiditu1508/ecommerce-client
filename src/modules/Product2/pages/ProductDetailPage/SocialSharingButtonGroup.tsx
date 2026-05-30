import FacebookIcon from "@mui/icons-material/Facebook";
import RedditIcon from "@mui/icons-material/Reddit";
import XIcon from "@mui/icons-material/X";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

function SocialSharingButtonGroup() {
  return (
    <Box sx={{
      display: "flex",
      gap: 1,
      alignItems: "center",
      height: "min-content",
    }}>
      <Typography variant="subtitle2">SHARE</Typography>
      <IconButton sx={{ color: "#1877f2" }}>
        <FacebookIcon />
      </IconButton>
      <IconButton sx={{ color: "#000000" }}>
        <XIcon />
      </IconButton>
      <IconButton sx={{ color: "#ff4500" }}>
        <RedditIcon />
      </IconButton>
    </Box>
  );
}

export default SocialSharingButtonGroup;
