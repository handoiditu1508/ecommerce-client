import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import { AccordionSummary, AccordionSummaryProps, styled } from "@mui/material";

type OwnProps = {
  onClose?: React.MouseEventHandler<SVGSVGElement>;
};

type ClosableAccordionSummaryProps = OwnProps & Omit<AccordionSummaryProps, keyof OwnProps>;

const ClosableAccordionSummary = styled(({ onClose, children, ...props }: ClosableAccordionSummaryProps) => {
  const handleClose: React.MouseEventHandler<SVGSVGElement> = (event) => {
    event.stopPropagation();
    onClose && onClose(event);
  };

  return (
    <AccordionSummary
      expandIcon={<ChevronRightIcon />}
      {...props}
    >
      {children}
      <CloseIcon className="closeIcon" onClick={handleClose} />
    </AccordionSummary>
  );
})(({ theme }) => ({
  flexDirection: "row-reverse",
  ".MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  ".MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
    justifyContent: "space-between",
    ".closeIcon": {
      color: theme.palette.action.active,
      "&:hover": {
        color: theme.palette.error.main,
      },
    },
  },
}));

export default ClosableAccordionSummary;
