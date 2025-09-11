import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";

function MoreOptionsModal() {
  return (
    <Paper sx={{
      display: "flex",
    }}>
      <List
        aria-labelledby="more-opt-1"
        subheader={<ListSubheader id="more-opt-1">Subheader 1</ListSubheader>}>
        <ListItemButton component={Link} to="/">
          <ListItemText primary="Option 1" />
        </ListItemButton>
        <ListItemButton component={Link} to="/">
          <ListItemText primary="Option 2" />
        </ListItemButton>
        <ListItemButton component={Link} to="/">
          <ListItemText primary="Option 3" />
        </ListItemButton>
      </List>
      <List
        aria-labelledby="more-opt-2"
        subheader={<ListSubheader id="more-opt-2">Subheader 2</ListSubheader>}>
        <ListItemButton component={Link} to="/">
          <ListItemText primary="Option 1" />
        </ListItemButton>
        <ListItemButton component={Link} to="/">
          <ListItemText primary="Option 2" />
        </ListItemButton>
        <ListItemButton component={Link} to="/">
          <ListItemText primary="Option 3" />
        </ListItemButton>
      </List>
      <List
        aria-labelledby="more-opt-3"
        subheader={<ListSubheader id="more-opt-3">Subheader 3</ListSubheader>}>
        <ListItemButton component={Link} to="/">
          <ListItemText primary="Option 1" />
        </ListItemButton>
        <ListItemButton component={Link} to="/">
          <ListItemText primary="Option 2" />
        </ListItemButton>
        <ListItemButton component={Link} to="/">
          <ListItemText primary="Option 3" />
        </ListItemButton>
      </List>
    </Paper>
  );
}

export default MoreOptionsModal;
