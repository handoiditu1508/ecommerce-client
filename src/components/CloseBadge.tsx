import { stopBubbling } from "@/common/eventHelpers";
import CloseIcon from "@mui/icons-material/Close";
import { Badge, BadgeProps, styled } from "@mui/material";

type OwnProps = {
  hidden?: boolean;
  onClose?: React.MouseEventHandler<HTMLSpanElement>;
};

type CloseBadgeProps = OwnProps & Omit<BadgeProps, keyof OwnProps>;

const CloseBadge = styled(({ hidden, onClose = stopBubbling, ...props }: CloseBadgeProps) => {
  const handleClick: React.MouseEventHandler<HTMLSpanElement> = (event) => {
    event.stopPropagation();
    onClose(event);
  };

  return (
    <Badge
      color="error"
      badgeContent={hidden ? 0 : <CloseIcon />}
      slotProps={{
        badge: {
          onClick: handleClick,
        },
      }}
      {...props}
    />
  );
})(() => ({
  ".MuiBadge-badge": {
    display: "none",
    cursor: "pointer",
    paddingLeft: 0,
    paddingRight: 0,
    height: "auto",
    minWidth: "auto",
    ".MuiSvgIcon-root": {
      fontSize: "inherit",
    },
  },
  "&:hover": {
    ".MuiBadge-badge": {
      display: "flex",
      "&:hover": {
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3))",
      },
    },
  },
}));

export default CloseBadge;
