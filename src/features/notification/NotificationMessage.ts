import { AlertColor } from "@mui/material/Alert";

type NotificationMessage = {
  id?: React.Key;
  severity?: AlertColor;
  text: string;
};

export default NotificationMessage;
