import { SvgIcon, SvgIconProps } from "@mui/material";

type MdiSvgIconProps = {
  path: string;
} & Omit<SvgIconProps, "component" | "viewBox" | "inheritViewBox" | "children">;

export default function MdiSvgIcon({ path, ...props }: MdiSvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={path} />
    </SvgIcon>
  );
}
