import HomeIcon from "@mui/icons-material/Home";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import CustomLink from "../CustomLink";
import { BreadcrumbsItem } from "./models";

type DynamicBreadcrumbsProps = {
  items: BreadcrumbsItem[];
};

function DynamicBreadcrumbs({ items }: DynamicBreadcrumbsProps) {
  return (
    <Breadcrumbs aria-label="breadcrumb" maxItems={5}>
      <CustomLink to="/" underline="hover" color="inherit">
        <HomeIcon fontSize="inherit" />
      </CustomLink>
      {items.map((item, index, array) => {
        const isLast = index === array.length - 1;

        return (item.to === undefined)
          ? (
            <Typography
              key={index}
              color={isLast ? "textPrimary" : "inherit"}
              display="flex"
              alignItems="center"
              gap={0.5}
              sx={{
                "*": {
                  fontSize: "inherit",
                },
              }}>
              {item.icon}
              {item.label}
            </Typography>
          )
          : (
            <CustomLink
              key={index}
              to={item.to}
              underline="hover"
              color={isLast ? "textPrimary" : "inherit"}
              display="flex"
              alignItems="center"
              gap={0.5}
              sx={{
                "*": {
                  fontSize: "inherit",
                },
              }}>
              {item.icon}
              {item.label}
            </CustomLink>
          );
      })}
    </Breadcrumbs>
  );
}

export default DynamicBreadcrumbs;
