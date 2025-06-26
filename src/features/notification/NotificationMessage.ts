import { AlertColor } from "@mui/material";

type NotificationMessage = {
  id?: React.Key;
  severity?: AlertColor;
  text: string;
};

export default NotificationMessage;
